import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Grupo from '../../Models/Grupo'
import Utils from '../Utils'

export default class GruposController {
  public async setRegistrarGrupo({ request, response }: HttpContextContract) {
    try {
      const dataGrupo = request.only(['codigo_grupo', 'nombre_grupo'])
      const codigoGrupo = dataGrupo.codigo_grupo
      const codigoGrupoExistente = await this.getValidarGrupoExistente(codigoGrupo)

      if (codigoGrupoExistente === 0) {
        await Grupo.create(dataGrupo)
        response.status(200).json({ msg: 'Grupo registrado con exito' })
      } else {
        response.status(400).json({ msg: 'Codigo del grupo ya se encuentra registrado!!' })
      }
    } catch (error) {
      console.log(error)
      response.status(500).json({ msg: 'Error en el servidor!' })
    }
  }

  private async getValidarGrupoExistente(codigo_grupo: Number): Promise<Number> {
    const total = await Grupo.query()
      .where({ codigo_grupo: codigo_grupo })
      .count('*')
      .from('grupos')
    return Utils.getAttributeFromDB(total)
  }
}
