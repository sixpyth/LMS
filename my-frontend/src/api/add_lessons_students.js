export async function add_lessons_students({ login, lesson_id }) {
    const res = await fetch("http://localhost:8000/api/v1/manager/add-student-to-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, lesson_id, })

    });
    
    const data = await res.json();

    if (!res.ok) {
        throw data; 
    }

    return data;

}
