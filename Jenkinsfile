pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/hardikpratapsingh/InsightOps.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t insightops-backend ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t insightops-frontend ./frontend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        echo "======================================"
                        echo "KUBECONFIG FILE LOCATION"
                        echo "======================================"
                        echo $KUBECONFIG_FILE

                        echo ""
                        echo "======================================"
                        echo "KUBECONFIG CONTENT"
                        echo "======================================"
                        cat $KUBECONFIG_FILE

                        export KUBECONFIG=$KUBECONFIG_FILE

                        echo ""
                        echo "======================================"
                        echo "CURRENT CONTEXT"
                        echo "======================================"
                        kubectl config current-context || true

                        echo ""
                        echo "======================================"
                        echo "KUBECTL CONFIG VIEW"
                        echo "======================================"
                        kubectl config view || true

                        echo ""
                        echo "======================================"
                        echo "KUBERNETES NODES"
                        echo "======================================"
                        kubectl get nodes

                        echo ""
                        echo "========== Deploy PostgreSQL =========="
                        kubectl apply -f kubernetes/postgres.yaml

                        echo ""
                        echo "========== Deploy Backend =========="
                        kubectl apply -f kubernetes/backend-deployment.yaml

                        echo ""
                        echo "========== Deploy Frontend =========="
                        kubectl apply -f kubernetes/frontend-deployment.yaml

                        echo ""
                        echo "========== Pods =========="
                        kubectl get pods

                        echo ""
                        echo "========== Services =========="
                        kubectl get svc
                    '''
                }
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh 'docker images | grep insightops'
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment Successful!'
        }

        failure {
            echo '❌ Deployment Failed!'
        }

        always {
            echo 'Pipeline Finished.'
        }
    }
}
