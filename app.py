"""
from flask import Flask, render_template, request, jsonify
import smtplib

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html", title="Home")

@app.route("/about")
def about():
    return render_template("about.html", title="About")

@app.route("/skills")
def skills():
    return render_template("skills.html", title="Skills")

@app.route("/projects")
def projects():
    return render_template("projects.html", title="Projects")

@app.route("/livehtml")
def livehtml():
    return render_template("livehtml.html", title="Live HTML")

@app.route("/education")
def education():
    return render_template("education.html", title="Education")

@app.route("/contact")
def contact():
    return render_template("contact.html", title="Contact")

@app.route("/inspire")
def inspire():
    return render_template("inspiration.html", title="Inspiration")

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        sender_email = "resumewebsite591@gmail.com"
        sender_password = "mdge wvwi htbs txum "
        receiver_email = "josefwolf591@gmail.com"

        subject = "New Contact Form Submission"
        body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
        email_message = f"Subject: {subject}\n\n{body}"

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, email_message)
            return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False})

if __name__ == "__main__":
    #app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
"""