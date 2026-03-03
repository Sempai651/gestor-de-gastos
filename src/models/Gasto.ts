import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Gasto extends Model {
  declare id: number;
  declare descripcion: string;
  declare monto: number;
  declare categoria: 'Comida' | 'Transporte' | 'Entretenimiento' | 'Utilities' | 'Otros';
  declare fecha: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Gasto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
        isDecimal: true
      }
    },
    categoria: {
      type: DataTypes.ENUM('Comida', 'Transporte', 'Entretenimiento', 'Servicios publicos', 'Otros'),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Gasto',
    tableName: 'gastos',
    timestamps: true,
    underscored: false
  }
);

export type CreateGastoDto = Omit<Gasto, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGastoDto = Partial<CreateGastoDto>;