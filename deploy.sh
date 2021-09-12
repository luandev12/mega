gcloud config set account nemo-mega  
gcloud auth login
gcloud config set project nemo-mega
gsutil cors set cors.json gs://nemo-mega.appspot.com