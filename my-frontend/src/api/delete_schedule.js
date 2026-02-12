export async function deleteSchedule(lesson_id) {
  return fetch(`http://localhost:8000/api/v1/manager/delete-schedule?lesson_id=${lesson_id}`, {
    method: "DELETE",
  });
}