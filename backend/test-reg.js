fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'testadmin',
        email: 'testadmin@admin.com',
        password: 'password123',
        adminKey: 'SECRET_ADMIN_KEY'
    })
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
