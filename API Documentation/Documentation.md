# SignUp api: POST:

**http://localhost:8000/auth/SignUp**


```
{
  "email": "testuser@example.com",
  "password": "securepassword",
  "name": "Test User",
  "age": 25,
  "weight": 70.5
}

```

---

# Login api: POST:

**http://localhost:8000/auth/Login**


```
{
  "email": "testuser@example.com",
  "password": "securepassword"
}
```


---

# Add Assesment result 

**http://localhost:5004/addassesment/assessments**

**Header**

"Authorization":  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0OTE1NDY4MiwiZXhwIjoxNzQ5NzU5NDgyfQ.veKJMkAwIJcnafv2XOV9ZTu1zlQBJTHxc4-gzcbq6rk"

```
{
  "assessmentName": "Anxiety Level Test",
  "assessmentResult": "Severe anxiety",
  "assessmentScore": "40 out of 40",
  "recommendation": "Your anxiety levels are high. It's recommended to seek professional help for proper evaluation and support.",
  "takenAt": "2025-06-05T19:01:03.946Z"
}
```


---


# Delete Assessment

**http://localhost:5004/addassesment/assessments/109**


**Header**

"Authorization":  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0OTE1NDY4MiwiZXhwIjoxNzQ5NzU5NDgyfQ.veKJMkAwIJcnafv2XOV9ZTu1zlQBJTHxc4-gzcbq6rk"


---


# research

**http://localhost:5004/research/research**

```

{
  "email": "user@example.com",
  "Q1": 3,
  "Q2": 4,
  "Q3": 2,
  "Q4": 5,
  "Q5": 1,
  "Q6": 4,
  "Q7": 3,
  "Q8": 2,
  "Q9": 5,
  "Q10": 1,
  "Q11": 4,
  "Q12": 3,
  "Q13": 2,
  "Q14": 5,
  "Q15": 1,
  "Q16": 4,
  "Q17": 3,
  "Q18": 2,
  "Q19": 5,
  "Q20": 1,
  "Q21": 4,
  "Q22": 3,
  "Q23": 2,
  "Q24": 5,
  "Q25": 1,
  "Q26": 4,
  "Q27": 3,
  "Q28": 2,
  "Q29": 5,
  "Q30": 1,
  "Q31": 4,
  "Q32": 3,
  "Q33": 2,
  "Q34": 5,
  "Q35": 1,
  "Q36": 4,
  "Q37": 3,
  "Q38": 2,
  "Q39": 5,
  "Q40": 1,
  "Q41": 4,
  "Q42": 3,
  "Q43": 2,
  "Q44": 5,
  "Q45": 1,
  "Q46": 4,
  "Q47": 3,
  "Q48": 2,
  "Q49": 5,
  "Q50": 1,
  "Q51": 4,
  "Q52": 3,
  "Q53": 2,
  "Q54": 5,
  "Q55": 1
}
```