import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Grupo from '../../Models/Grupo'
import Usuario from '../../Models/Usuario'
import UsuarioGrupo from '../../Models/UsuarioGrupo'

export default class GrupoUsuariosController {
  public async setRegistrarUsuarioGrupo({ request, response }: HttpContextContract) {
    try {
      const dataGrupoUsuario = request.only(['codigo_usuario', 'codigo_grupo', 'fecha_inicio'])
      const codigoUsuario = dataGrupoUsuario.codigo_grupo
      const codigoGrupo = dataGrupoUsuario.codigo_grupo
      const datosExistentes: Number = await this.getValidarDatosGrupoYUsuario(
        codigoGrupo,
        codigoUsuario
      )

      switch (datosExistentes) {
        case 0:
          await UsuarioGrupo.create(dataGrupoUsuario)
          response.status(200).json({ msg: 'Registro de usuario en grupo completo' })
          break
        case 1:
          response.status(400).json({ msg: 'El codigo del usuario no se encuentra registrado' })
          break
        case 2:
          response.status(400).json({ msg: 'El codigo del grupo no se encuentra registrado' })
          break
      }
    } catch (error) {
      console.log(error)
      response.status(500).json({ msg: 'Error en el servidor!' })
    }
  }

  private async getValidarDatosGrupoYUsuario(
    codigo_grupo: Number,
    codigo_usuario: Number
  ): Promise<Number> {
    let totalGrupos = await Grupo.query()
      .where({ codigo_grupo: codigo_grupo })
      .count('*')
      .from('grupos')
    let cantidadDatosGrupos = parseInt(totalGrupos[0]['count(*)'])

    if (cantidadDatosGrupos !== 0) {
      let totalUsuarios = await Usuario.query()
        .where({ codigo_usuario: codigo_usuario })
        .count('*')
        .from('usuarios')
      let cantidadDatosUsuarios = parseInt(totalUsuarios[0]['count(*)'])

      if (cantidadDatosUsuarios !== 0) return 0
      else return 2 // Si el metodo retorna 2, el codigo de usuario no existe
    } else {
      return 1
    }
  }
}
