# AWS-Depolyment

#Launch EC2 Instance
  Upload Frontend, Website in zip file form,  and AlertSystem in jar form with Elastic Beanstalk
  Lancun extra EC2 instance as database storage

#Set up MongoDB in AmazonLiux environment
  After install Mongodb, depoly the replica set with Keyfile Authentication, see the reference: [Keyfile Authentication](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/)https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/
  Create and Authenticate a User, see the reference: https://www.mongodb.com/docs/manual/tutorial/authenticate-a-user/

#Run Mongodb
  mongod --keyFile <path-to-keyfile> --replSet <replicaSetName> --bind_ip localhost,<hostname(s)|ip address(es)>

Current User to access admin databse: User: hopelandAdmin Password: hopeland
Current User to access hopelandsystems database: User: hopelandUser Password: hopeland


