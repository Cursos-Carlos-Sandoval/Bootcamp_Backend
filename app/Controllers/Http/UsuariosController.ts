import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from '../../Models/Usuario'
import Utils from '../Utils'

export default class UsuariosController {
  public async getListarUsuarios(): Promise<Usuario[]> {
    const user = await Usuario.all()
    return user
  }

  public async getListarUsuariosYPerfil(): Promise<Usuario[]> {
    const user = await Usuario.query().preload('perfil')
    return user
  }

  public async getListarUsuariosYPublicacion(): Promise<Usuario[]> {
    const user = await Usuario.query().preload('publicaciones')
    return user
  }

  public async getListarUsuariosGrupos(): Promise<Usuario[]> {
    const user = await Usuario.query().preload('usuario_grupos')
    return user
  }

  public async setRegistrarUsuarios({ request, response }: HttpContextContract) {
    const dataUsuario = request.only([
      'codigo_usuario',
      'nombre_usuario',
      'contrasena',
      'email',
      'telefono',
      'perfil',
    ])

    try {
      const codigoUsuario = dataUsuario.codigo_usuario
      const usuarioExistente: Number = await this.getValidarUsuarioExistente(codigoUsuario)

      if (usuarioExistente === 0) {
        await Usuario.create(dataUsuario)
        response.status(200).json({ msg: 'Registro completado con exito' })
      } else {
        response.status(400).json({ msg: 'Error, el codigo usuario ya se encuentra registrado' })
      }
    } catch (error) {
      response.status(500).json({ msg: 'Error en el servidor!' })
    }
  }

  private async getValidarUsuarioExistente(codigo_usuario: Number): Promise<Number> {
    const total = await Usuario.query()
      .where({ codigo_usuario: codigo_usuario })
      .count('*')
      .from('usuarios')
    return Utils.getAttributeFromDB(total)
  }

  public async buscarPorId({ request }: HttpContextContract) {
    const id = request.param('id')
    const user = await Usuario.find(id)
    return user
  }

  public async actualizarUsuario({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const user = request.all()
    await Usuario.query().where('codigo_usuario', id).update({
      nombre_usuario: user.nombre_usuario,
      contrasena: user.constrasena,
      email: user.email,
      telefono: user.telefono,
    })
    response.status(200).json({ msg: 'Registro actualizado con exito' })
  }

  public async eliminarUsuario({ request, response }: HttpContextContract) {
    const id = request.param('id')
    await Usuario.query().where('codigo_usuario', id).delete()
    response.status(200).json({ msg: 'Registro eliminado con exito' })
  }

  public async filtroPorNombre({ request, response }: HttpContextContract) {
    const { search } = request.all()
    const users = await Usuario.query().where('nombre_usuario', 'like', `${search}%`)
    response.status(200).json({ msg: 'Resultados', users: users })
  }
}
