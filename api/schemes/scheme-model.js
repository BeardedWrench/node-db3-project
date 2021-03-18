const db = require('../../data/db-config');

function find() {
  return db.select('schemes')
        .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
        .column('schemes.scheme_id', 'schemes.scheme_name')
        .count({ number_of_steps: 'steps.step_id' })
        .groupBy('schemes.scheme_id')
        .orderBy('schemes.scheme_id', 'ASC');
}

async function findById(scheme_id) {
  const query = await db('schemes')
  .column('schemes.scheme_id', 'schemes.scheme_name', 'steps.*')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .where('schemes.scheme_id', scheme_id)
  .orderBy('steps.step_number', 'ASC');

  return query;
}

async function findSteps(scheme_id) { 
  const arr = await db.select('schemes.scheme_name')
  .select('steps.step_id', 'steps.step_number', 'steps.instructions')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .where('schemes.scheme_id', scheme_id)
  .orderBy('steps.step_number')

  return arr[0]["step_id"] ? arr : [];
}

async function add(scheme) {
    const [result] = await db('schemes')
                          .insert({ "scheme_name": scheme }, ["scheme_id"])


    return { ...scheme, "scheme_id": result };
}

async function addStep(scheme_id, step) { 
    const { step_number, instructions } = step;
    await db('steps')
            .insert({
              "step_number": step_number,
              "instructions": instructions,
              "scheme_id": scheme_id,
            })
    return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
