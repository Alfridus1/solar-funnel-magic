import { BaseTables } from './tables/base-tables';
import { EmployeeTables } from './tables/employee-tables';
import { ProductTables } from './tables/product-tables';
import { ProjectTables } from './tables/project-tables';

export interface Tables extends 
  BaseTables,
  EmployeeTables,
  ProductTables,
  ProjectTables {}