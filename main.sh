#!/bin/sh

cmd=${1}
location=${2}
new_package=${3}

CONFCLIENT=/usr/sbin/confclient
vadplocation=$(dirname $(readlink -f $0))
reloadconf_path=${vadplocation}/bin/reload_mvaasconf
startovpn_path=${vadplocation}/bin/start_ovpn

use_default_userpass()
{
        # For MVaaS field try
        ACCOUNTMGR="/usr/sbin/accountmgr"
        UPDATE_SECURITY="/usr/bin/update_security"
        ROOT_PASS="root"
        MVAAS_ACCOUNT="vivotekmvaas"
        MVAAS_PASS="vivotekmvaas"
        MVAAS_PRIV="admin"
        ${ACCOUNTMGR} -n root -e passwd -x ""
		${ACCOUNTMGR} -d -n "${MVAAS_ACCOUNT}"
        ${ACCOUNTMGR} -a -n "${MVAAS_ACCOUNT}" -x "${MVAAS_PASS}" -r "${MVAAS_PRIV}"
        ${CONFCLIENT} -p 99 -b -s "security_user_i1_name=${MVAAS_ACCOUNT}&security_user_i1_pass=${MVAAS_PASS}&security_user_i1_privilege=${MVAAS_PRIV}"
        $UPDATE_SECURITY
		$vadplocation/bin/set_mvaasconf "ActEZConnectAccountReset" 1
}

get_vadpname()
{
	tmp=`grep '<name>' $vadplocation/vadp.xml | sed 's/<name>\(.*\)<\/name>/\1/'`
	name="$(echo -e "${tmp}" | tr -d '[[:space:]]')"
	echo ${name}
}

revise_openconf()
{
	sed -i "s#ca \/ovpn\/ca.crt#ca $vadplocation/\ovpn\/ca.crt#" $vadplocation/conf.d/openvpn.conf
	sed -i "s#cert \/ovpn\/client1.crt#cert $vadplocation/\ovpn\/client1.crt#" $vadplocation/conf.d/openvpn.conf
	sed -i "s#key \/ovpn\/client1.key#key $vadplocation/\ovpn\/client1.key#" $vadplocation/conf.d/openvpn.conf
}

revise_mvaasconf()
{
	sed -i "s#OpenVPNScriptPath \/usr\/bin\/start_ovpn#OpenVPNScriptPath $startovpn_path#" $vadplocation/conf.d/mvaasd.conf
	sed -i "s#HTTPExtraInfoUrl \/cgi-bin\/getparam.cgi#HTTPExtraInfoUrl \/`get_vadpname`\/cgi-bin\/get_param.cgi#" $vadplocation/conf.d/mvaasd.conf

}

case ${cmd} in
	start)
		use_default_userpass
		revise_openconf
		revise_mvaasconf
		LD_LIBRARY_PATH=$vadplocation/lib $vadplocation/mvaasd -c $vadplocation/conf.d/mvaasd.conf -d 
		$vadplocation/bin/reload_mvaasconf
		;;
	stop)
		start-stop-daemon -K --signal 15 --quiet --name mvaasd
		start-stop-daemon -K --signal 15 --quiet --name openvpn
		;;
	install)
		if ! grep -q $reloadconf_path /etc/CDF.xml
		then
			sed -i "s#\/usr\/bin\/gen_etc_network_interfaces#\/usr\/bin\/gen_etc_network_interfaces;$reloadconf_path#" /etc/CDF.xml
			/etc/init.d/configer restart
		fi
		;;
	upgrade)
		echo "Upgrade Remote Management."
		rm -rf ${location}
		mv ${new_package} ${location}
		;;
	backup)
		echo "backup ."
		;;
	reload)
		echo "reload ."
		;;
	restore)
		echo "restore ."
		;;
	*)
		start-stop-daemon -K --signal 15 --quiet --name mvaasd
		start-stop-daemon -K --signal 15 --quiet --name openvpn
		sed -i "s#\/usr\/bin\/gen_etc_network_interfaces;$reloadconf_path#\/usr\/bin\/gen_etc_network_interfaces#" /etc/CDF.xml
		/etc/init.d/configer restart
		;;
esac

exit 0

