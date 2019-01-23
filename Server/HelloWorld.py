# DEBUG = True
import os
from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import numpy as np
from skimage import io
from skimage.color import rgb2gray
from skimage.transform import resize


UPLOAD_FOLDER = './upload/'
ALLOWED_EXTENSIONS = set(['pnd', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 64 * 1024 * 1024 # 64 MB

saved_file = ''

app = Flask(__name__)
#app.config.from_object(config)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    #return '.' in filename and \
    #    filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
    return True

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
            saved_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if saved_file and saved_file != '':
                file.save(saved_file)
                file_url = url_for('uploaded_file', filename=filename)
                # return 'Success'

                # classification part
                # 1st step read file
                input_pic = rgb2gray(io.imread(saved_file))
                input_pic_resized = resize(input_pic, (200, 200))

                edge = np.mean(input_pic_resized[10:30,10:30] + input_pic_resized[90:110,10:30] + input_pic_resized[170:190,10:30] \
                    + input_pic_resized[10:30,90:110] + input_pic_resized[170:190,90:110] + input_pic_resized[10:30,170:190] \
                    + input_pic_resized[90:110,170:190] + input_pic_resized[170:190,170:190])/8
                if np.mean(input_pic_resized[90:110,90:110]) > edge:
                    print("--------------------\n")
                    print("mean: " + str(np.mean(input_pic_resized[90:110,90:110])))
                    print("edge: " + str(edge))
                    print("--------------------\n")
                    return 'Success,white'
                else:
                    print("--------------------\n")
                    print("mean: " + str(np.mean(input_pic_resized[90:110,90:110])))
                    print("edge: " + str(edge))
                    print("--------------------\n")
                    return 'Success,red'
    return 'Fail'

@app.route('/upload/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0',
            port=443, ssl_context=(
                "server.pem",
                "server.key"
        )
    )
