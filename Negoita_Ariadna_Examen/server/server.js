const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')
const path=require('path')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const JobPosting = sequelize.define('job', {
  
  descriere:{
    type:Sequelize.STRING,
    len:{min:3}


  },
  deadline:{
    type:Sequelize.DATEONLY
  }
  
})

const Candidate = sequelize.define('candidate', {
 
  nume:{
    type:Sequelize.STRING,
    len:{min:5}

  },
  cv:{
    type:Sequelize.STRING,
    len:{min:100}

  },
  email:{
    type:Sequelize.STRING,
    validate: { isEmail: true },

  },
})

JobPosting.hasMany(Candidate)

const app = express()
app.use(cors())
// app.use(express.static(path.join(__dirname,'build')))
app.use(bodyParser.json())

app.get('/sync', async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    res.status(201).json({ message: 'created' })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/jobs', async (req, res) => {
  try {
    const query = {}
    let pageSize = 2
    const allowedFilters = ['descriere', 'deadline']
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
      query.where = {}
      for (const key of filterKeys) {
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
    }

    const sortField = req.query.sortField
    let sortOrder = 'ASC'
    if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }

    if (sortField) {
      query.order = [[sortField, sortOrder]]
    }

    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }

    const records = await JobPosting.findAll(query)
    const count = await JobPosting.count()
    res.status(200).json({ records, count })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/jobs', async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === 'on') {
      await JobPosting.bulkCreate(req.body)
      res.status(201).json({ message: 'created' })
    } else {
      await JobPosting.create(req.body)
      res.status(201).json({ message: 'created' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id)
    if (job) {
      res.status(200).json(job)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id)
    if (job) {
      await job.update(req.body, { fields: ['descriere', 'deadline']})
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id, { include: Candidate })
    if (job) {
      await job.destroy()
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/jobs/:sid/candidates', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.sid)
    if (job) {
      const candidates = await job.getCandidates()

      res.status(200).json(candidates)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/jobs/:sid/candidates/:cid', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.sid)
    if (job) {
      const candidates = await job.getCandidates({ where: { id: req.params.cid } })
      res.status(200).json(candidates.shift())
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/jobs/:sid/candidates', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.sid)
    if (job) {
      const candidate = req.body
      candidate.jobId = job.id
      console.warn(candidate)
      await Candidate.create(candidate)
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/jobs/:sid/candidates/:cid', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.sid)
    if (job) {
      const candidates = await job.getCandidates({ where: { id: req.params.cid } })
      const candidate = candidates.shift()
      if (candidate) {
        await candidate.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/jobs/:sid/candidates/:cid', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.sid)
    if (job) {
      const candidates = await job.getCandidates({ where: { id: req.params.cid } })
      const candidate = candidates.shift()
      if (candidate) {
        await candidate.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error1' })
  }
})


app.listen(8080)
