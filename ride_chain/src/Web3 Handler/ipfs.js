import {create} from 'ipfs-http-client'
import { PROJECT_ID, PROJECT_SECRET } from '../../../secrets'

const projectId = PROJECT_ID;
const projectSecret = PROJECT_SECRET;
const auth = 'Basic ' + btoa(projectId + ':' + projectSecret);
let ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  }
})
export default ipfs