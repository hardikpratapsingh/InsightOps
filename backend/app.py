# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def home():
#     return {
#         "project": "InsightOps",
#         "message": "Welcome to InsightOps 🚀"
#     }

# @app.route("/health")
# def health():
#     return {
#         "status": "healthy"
#     }

# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, jsonify, request
# from db import get_connection
# import psycopg2

# app = Flask(__name__)

# def get_connection():
#     return psycopg2.connect(
#         host="localhost",
#         database="insightops",
#         user="postgres",
#         password="Hardik@123"   # 👈 apna password yahan likhna
#     )

# @app.route("/")
# def home():
#     return {"message": "Welcome to InsightOps 🚀"}

# @app.route("/employees")
# def employees():
#     conn = get_connection()
#     cur = conn.cursor()

#     cur.execute("SELECT id, name, department, salary FROM employees;")
#     rows = cur.fetchall()

#     cur.close()
#     conn.close()

#     result = []
#     for row in rows:
#         result.append({
#             "id": row[0],
#             "name": row[1],
#             "department": row[2],
#             "salary": float(row[3])
#         })

#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)


# Home Route
@app.route("/")
def home():
    return {
        "project": "InsightOps",
        "message": "Welcome to InsightOps 🚀"
    }


# GET - Fetch all employees
@app.route("/employees", methods=["GET"])
def get_employees():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, department, salary FROM employees ORDER BY id;")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "department": row[2],
            "salary": float(row[3])
        })

    return jsonify(result)


# POST - Add employee
@app.route("/employees", methods=["POST"])
def add_employee():
    data = request.get_json()

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO employees (name, department, salary)
        VALUES (%s, %s, %s)
        """,
        (
            data["name"],
            data["department"],
            data["salary"]
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Employee added successfully"
    }), 201


# DELETE - Delete employee
@app.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM employees WHERE id = %s",
        (id,)
    )

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Employee deleted successfully"
    })

@app.route("/employees/<int:id>", methods=["PUT"])
def update_employee(id):
    data = request.get_json()

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE employees
        SET name = %s,
            department = %s,
            salary = %s
        WHERE id = %s
        """,
        (
            data["name"],
            data["department"],
            data["salary"],
            id
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Employee updated successfully"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)