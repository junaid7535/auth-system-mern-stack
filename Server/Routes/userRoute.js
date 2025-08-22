import express from 'express'
const router = express.Router()
import { getUserData,getData } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

router.get('/data',userAuth,getUserData)

router.get('/getData',getData)

export default router
