# Project: Song Lyric Caption Generator 

## One Sentence Description

A web application that analyzes images and generates song lyrics as a caption. 

## Paragraph
We will use Flask and React to build the web application. Based on the image analysis, we will use the Genius API to retrieve song lyrics. We plan to use Gemini for the segmentation analysis. Ideally, a user would input an image into the web app, which would generate an accompanying set of song lyrics as a caption for the image. 

## User Roles
- **Anonymous User**: Anyone on the web who isn't logged in. They can view the website and get information about our app and pricing but cannot do anything about it.
- **Simple User**: A logged-in user who occasionally uploads a single photo and casually interacts with our app.
- **Power User**: A logged-in user who bulk-uploads many photos and interacts with our app frequently.
- **Admin**: A privileged user who manages other users and access across the app and can see information pertaining to the app. 

## Full Names and Github ID: 

- Sanjana Shankar, GitHub ID: Sanjana-Shankar 
- Kavya Verma, GitHub ID: Kavya75 
- Alice Zhong, GitHub ID: alicezhong1 
- David Sim, GitHub ID: dscpsyl 
- Abhishek Ambastha, GitHub ID: abhishekambastha04 
- Saahas Buricha, GitHub ID: saahasburicha 
- Angel Gutierrez, GitHub ID: AngelG261

## Installation

### Prerequisites

Your system will need to have the following items installed beforehand.

- Python>=3.13
- Git
- Google Chrome
- Nodejs>=22.13.0

### Dependencies

#### Nodejs
- react

#### Python
- flask
- selenium
- gunicorn
- pillow
- python-dotenv
- google
- pymongo
- webdriver_manage 

### Installation Steps

#### Nodejs

#### Python3

1. First, create a virtual environment for your project.

```
python3 -m venv .venv
```

3. Activate the environment and install the required dependencies.

```
source .venv/bin/activate
```
```
pip install {dependencies}
```

4. Add in your .env file with your own GOOGLE Oauth and Gemini API Keys
```
vim hello-world/.env
```
```
CLIENT_ID=
CLIENT_SECRET=
SECRET_KEY=
GEMINI_API_KEY=
```

6. Start the backend

```
cd HelloWorldFlask && python3 app.py
```

3. In a new terminal, start the frontend

```
npm start
```

## Functionality

1. Visit the web page and login or create an account
2. Upload a photo in `.jpg` format
3. Wait for the webpage to display your result.

## Known Problems and Limitations

1. Currently, our app only works with `.jpg` formatted images.
2. Currently, our app only has a predefined list of songs.
3. Currently, our app requires a head-ed browser to work.


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License
See [`LICENSE`](https://github.com/ucsb-cs148-w25/pj02-lyricgenerator/blob/main/LICENSE) (GPL 3.0)
