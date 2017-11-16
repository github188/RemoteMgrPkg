#!/bin/sh

echo -ne "Content-type:text/plain\r\n"
echo -ne "\r\n" # end of HTTP header

groupid=`grep 'system_location_groupid' ../mvaas.xml | sed 's/<system_location_groupid>\(.*\)<\/system_location_groupid>/\1/'`
deviceid=`grep 'system_location_deviceid' ../mvaas.xml | sed 's/<system_location_deviceid>\(.*\)<\/system_location_deviceid>/\1/'`
hostname=`confclient -p 99 -g system_hostname|awk -F'=' '{print $2}'`
serveraddr=`grep 'system_mvaas_registerserver_address' ../mvaas.xml | sed 's/<system_mvaas_registerserver_address>\(.*\)<\/system_mvaas_registerserver_address>/\1/'`
serverport=`grep 'system_mvaas_registerserver_port' ../mvaas.xml | sed 's/<system_mvaas_registerserver_port>\(.*\)<\/system_mvaas_registerserver_port>/\1/'`
logserveraddr=`grep 'system_mvaas_logserver_address' ../mvaas.xml | sed 's/<system_mvaas_logserver_address>\(.*\)<\/system_mvaas_logserver_address>/\1/'`
logserverport=`grep 'system_mvaas_logserver_port' ../mvaas.xml | sed 's/<system_mvaas_logserver_port>\(.*\)<\/system_mvaas_logserver_port>/\1/'`

echo "system_hostname='${hostname}'"
echo "system_location_groupid='${groupid}'"
echo "system_location_deviceid='${deviceid}'"
echo "system_mvaas_registerserver_address='${serveraddr}'"
echo "system_mvaas_registerserver_port='${serverport}'"
echo "system_mvaas_logserver_address='${logserveraddr}'"
echo "system_mvaas_logserver_port='${logserverport}'"
exit 0
