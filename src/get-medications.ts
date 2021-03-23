import { APIGatewayProxyHandler } from 'aws-lambda';
import { rdsDataService, rdsParams } from './utils/db';
import { responseBase } from './utils/response';
import { Med, Medication, Response, T } from './utils/types';

export const main: APIGatewayProxyHandler = async () => {
  const sql =
    'select m.*, mc.name category_name from medication m join medication_category mc on m.category_id = mc.id;';

  const result = await rdsDataService
    .executeStatement({
      ...rdsParams,
      sql,
    })
    .promise();

  const data: Medication[] = result.records?.map((med) => {
    const id: number = med[Med.ID][T.NUMBER];
    const name = med[Med.NAME][T.STRING];
    const strength = med[Med.STRENGTH][T.STRING];
    const categoryId = med[Med.ID][T.NUMBER];
    const categoryName = med[Med.CATEGORY_NAME][T.STRING];
    const createdAt = med[Med.CREATED_AT][T.STRING];
    const modifiedAt = med[Med.MODIFIED_AT][T.STRING];

    console.log(med);

    const medication: Medication = {
      id,
      name,
      strength,
      categoryId,
      categoryName,
      createdAt,
      modifiedAt,
    };

    return medication;
  });

  const response: Response = {
    ...responseBase,
    body: JSON.stringify(data),
  };

  return response;
};
