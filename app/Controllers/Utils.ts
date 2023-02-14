import Env from '@ioc:Adonis/Core/Env'

export default class Utils {
  public static getAttributeFromDB(queryResult: object) {
    let objetctReference = ''
    switch (Env.get('DB_CONNECTION')) {
      case 'pg':
        objetctReference = 'count'
        break
      case 'mysql':
        objetctReference = 'count(*)'
        break
      default:
        throw new Error('INVALID DATABASE REFERENCE - INTERNAL ERROR')
    }

    return parseInt(queryResult[0][`${objetctReference}`])
  }
}
