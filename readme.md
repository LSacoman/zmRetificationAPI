{
	"method": "median", // método que será utilizado para realizar a retificação (median, open, close, openandclose)
	"kernelSize": 11, // tamanho da janela que será utilizada (tem de ser um número ímpar)
	"kernelFormat": "ellipse", // formato da janela que será utilizada (rect, ellipse, cross)
	"iterations": 1, // número de iterações utilizado somente nos filtros de abertura e fechamento
	"zmDataFormat": "csv" // formato que os dados da ZM seram enviados CSV -> separado por quebra de linha ('\n') ou string -> separado por ponto e virgula (';') caso csv no postman utilizar x-www-form-urlencoded
  
	// dados a que devem ser retificados devem estar no formato "Longitude, Latitude, Ponto, C2, C3, C4, C5;" Ex:"-53.570684808,-24.952417737,1,2,3,2,3;"
	"zmData": "-53.570684808,-24.952417737,1,2,3,2,3;-53.570616162,-24.952485076,2,2,2,2,3;-53.570616162,-24.952417737,3,2,3,2,3;-53.570547517,-24.952619754,4,2,2,2,3;-53.570547517,-24.952552415,5,2,2,2,3;-53.570547517,-24.952485076,6,2,2,2,3;-53.570478871,-24.952687093,7,2,2,2,3;-53.570478871,-24.952619754,8,2,2,2,3;-53.570478871,-24.952552415,9,2,2,2,3;-53.570478871,-24.952485076,10,2,2,2,3;-53.570410226,-24.952754433,11,2,3,2,3;-53.570410226,-24.952687093,12,2,2,2,3;-53.570410226,-24.952619754,13,2,2,2,3;-53.570410226,-24.952552415,14,2,2,2,3;-53.570410226,-24.952485076,15,2,2,2,3;-53.570341581,-24.952821772,16,2,3,2,4;-53.570341581,-24.952754433,17,2,3,2,3;-53.570341581,-24.952687093,18,2,3,2,3;-53.570341581,-24.952619754,19,2,2,2,3;-53.570341581,-24.952552415,20,2,3,2,3;-53.570272935,-24.952956450,21,1,3,1,4;-53.570272935,-24.952889111,22,1,3,1,4;-53.570272935,-24.952821772,23,1,3,1,4;-53.570272935,-24.952754433,24,1,3,2,4;-53.570272935,-24.952687093,25,2,3,2,4;-53.570272935,-24.952619754,26,2,3,2,3;-53.570272935,-24.952552415,27,2,3,2,3;"

}