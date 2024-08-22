mysqldump -u simcpkp -p --host="16.78.93.145" simcpkp > backup.sql

mysql -u simcpkp -p --host="31.170.165.10" simcpkp < backup.sql
