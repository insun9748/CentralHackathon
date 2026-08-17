import { apiClient, unwrap } from './client.js'

export async function getCategories() {
  const response = await apiClient.get('/categories')
  return unwrap(response) // { timeCategories: [{timeCategoryId, name}], intensities: [{intensityId, level, description}] }
}
