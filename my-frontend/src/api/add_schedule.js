export async function add_schedule({ start,finish,teacher_login, format, type, color, teacher, lesson_id }) {
    const res = await fetch("http://localhost:8000/api/v1/manager/set-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({start, finish, teacher_login, format, type, color, teacher, lesson_id})

    });
    
    const data = await res.json();

    if (!res.ok) {
        throw data; 
    }

    return data;

}
