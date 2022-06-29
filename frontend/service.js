const baseListURL = "http://localhost:3001/api/lists";
const baseTaskURL = "http://localhost:3001/api/tasks";

const getListById = async (id) => {
  const response = await axios.get(`${baseListURL}/${id}`);
  return response.data;
};

const updateListById = async (updatedList) => {
  await axios.put(`${baseListURL}/${updatedList.id}`, updatedList);
};

const postTaskToOneList = async (listId, newTask) => {
  const response = await axios.post(`${baseTaskURL}/${listId}`, newTask);
  return response.data;
};

const updateCheckedStatus = async (listId, updatedTask) => {
  console.log(updatedTask);
  await axios.put(`${baseTaskURL}/${listId}/${updatedTask.id}`, updatedTask);
};

const deleteTaskFromOneList = async (listId, taskToDeleteId) => {
  await axios.delete(`${baseTaskURL}/${listId}/${taskToDeleteId}`);
};
