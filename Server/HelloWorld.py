# DEBUG = True
import os
from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/Users/ly/Documents/GitHub/acne_detect/Server/upload'
ALLOWED_EXTENSIONS = set(['pnd', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 64 * 1024 * 1024 # 64 MB

app = Flask(__name__)
#app.config.from_object(config)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

html = '''
    <!DOCTYPE html>
    <title>Upload File</title>
    <h1>Upload Pic</h1>
    <form action=upload method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=upload>
    </form>
'''

@app.route('/')
def hello_world():
    return html

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            file_url = url_for('uploaded_file', filename=filename)
            return 'Success'
        return 'Fail'

@app.route('/upload/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0',
            port=443, ssl_context=(
                "server.crt",
                "server.key"
        )
    )
