import axios from 'axios'

const glpi = axios.create({
  baseURL: 'https://chamadosti.pronutrir.com.br/apirest.php/',
  headers: {
    'Content-Type': 'application/json',
    'App-Token': 'y6UDMJ3rLd2tCCrcwGmWDA7bnxBPlIyP5J1AGM6c',
  },
})

export default glpi
