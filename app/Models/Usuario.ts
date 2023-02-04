import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Perfil from './Perfil'
import Publicacione from './Publicacione'
import Grupo from './Grupo'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true }) public codigo_usuario: number
  @column() public nombre_usuario: string
  @column() public contrasena: string
  @column() public email: string
  @column() public telefono: string

  // Relacion 1:1 con Perfil
  @hasOne(() => Perfil, {
    localKey: 'codigo_usuario',
    foreignKey: 'codigo_usuario',
  })
  public perfil: HasOne<typeof Perfil>

  // Relacion 1:n con Publicaciones
  @hasMany(() => Publicacione, {
    localKey: 'codigo_usuario',
    foreignKey: 'codigo_usuario',
  })
  public publicaciones: HasMany<typeof Publicacione>

  // Relacion n:m con Grupo
  @manyToMany(() => Grupo, {
    localKey: 'codigo_usuario', // Llave primaria tabla usuario
    pivotForeignKey: 'codigo_usuario', // Llave foranea de la nueva tabla [ usuario_grupo ]
    relatedKey: 'codigo_grupo', // Llave primaria de la tabla grupo
    pivotRelatedForeignKey: 'codigo_grupo', // Llave foranea de la nueva tabla [ usuario_grupo ]
    pivotTable: 'usuario_grupos', // Nombre de nueva tabla N:M [ ManyToMany ]
  })
  public usuario_grupos: ManyToMany<typeof Grupo>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
