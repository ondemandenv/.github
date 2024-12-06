Declare app/service in ContractsLib, ondemandenv will interpret it and create infrastructures including
build/deploy job, roles with least privileges and trigger it when dependency changes.
User will need to create script to implement the produces/outputs in ContractsLib.

3 types of app/service, Ondemandenv will provide all environment variables
when trigger the job.

1) Docker image, .scripts/build.sh should produce images according to its declaration in ContractsLib.
2) General app/service, .scripts/build.sh should produce values to its declaration in ContractsLib.
3) CDK application can do it with code when using ContractsLib.

