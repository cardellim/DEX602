# Execute in Code Builder terminal using: ./EXFiles/scripts/CreateOrg.sh
echo "*** Creating scratch Org..."
sf org create scratch --definition-file config/project-scratch-def.json --set-default --alias soDEX602 --duration-days 30
echo "*** Pushing metadata to scratch Org..."
sf project deploy start
echo "*** Assigning permission set to your user..."
sf org assign permset --name Certification
echo "*** Creating required users..."
sf apex run --file EXFiles/data/CreateUsers.txt
echo "*** Creating data"
# sfdx ETCopyData:import -c EXFiles/data --loglevel warn
sf apex run --file EXFiles/data/DeleteAndLoadData.txt