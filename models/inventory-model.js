const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
  } catch (error) {
    console.error("getClassifications error:", error)
    return { rows: [] }
  }
}

/* ***************************
 *  Get inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    return []
  }
}

/* ***************************
 *  Get a single vehicle by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error:", error)
    return null
  }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function addClassification(classification_name) {
  const sql =
    "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id"
  try {
    const result = await pool.query(sql, [classification_name])
    return result.rowCount === 1
  } catch (error) {
    console.error("addClassification error:", error)
    return false
  }
}

/* ***************************
 *  Insert a new inventory item
 * ************************** */
async function addInventory({
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id,
}) {
  const sql = `INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color, classification_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING inv_id`

  const params = [
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  ]

  try {
    const result = await pool.query(sql, params)
    return result.rowCount === 1
  } catch (error) {
    console.error("addInventory error:", error)
    return false
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
}