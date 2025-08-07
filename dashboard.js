// 🚀 GITHUB VEHICLE DASHBOARD - COMPLETE FUNCTIONALITY RESTORED
// All original .gs script features + Google Sheets API integration

class VehicleDashboard {
    constructor() {
        this.apiKey = '';
        this.sheetId = '';
        this.ranges = [];
        this.cache = {};
        this.charts = {};
        this.loadStartTime = Date.now();
        this.debounceTimer = null;
        
        // --- ADDED: Local data string from .txt file ---
        this.localDataString = `Date	Location / Site	Vehicle Number/ Chassis Number	Client Name	Vehicle Type	Installation Date	Working Status	Recording	Allignmnent	Remarks
5-August-2025	Bangalore	KA03AN6571	AUTOLIV IND PVT LTD	Bus	08/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8425	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8187	AUTOLIV IND PVT LTD	Bus	09/06/2025	Offlline >24Hrs	NA	NA	Offline since 6 days
5-August-2025	Bangalore	KA03AN8182	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8181	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8424	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8183	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8188	AUTOLIV IND PVT LTD	Bus	09/06/2025	Active	Yes	Alligned	Black screen with time stamp
5-August-2025	Bangalore	KA01AP5774	AUTOLIV IND PVT LTD	Tempo Traveller	09/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5773	AUTOLIV IND PVT LTD	Tempo Traveller	11/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5772	AUTOLIV IND PVT LTD	Tempo Traveller	11/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5776	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5770	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5755	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AQ0238	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5775	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5780	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5768	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5767	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5771	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA51AJ9761	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5781	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ9763	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AP5779	AUTOLIV IND PVT LTD	Bus	25/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA51AJ5672	AUTOLIV IND PVT LTD	Bus	26/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ9764	AUTOLIV IND PVT LTD	Bus	26/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AQ0235	AUTOLIV IND PVT LTD	Bus	26/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AQ0237	AUTOLIV IND PVT LTD	Bus	26/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA01AQ0239	AUTOLIV IND PVT LTD	Bus	27/06/2025	Offlline >24Hrs	NA	NA	Offline since 3 days
5-August-2025	Bangalore	KA01AJ9762	AUTOLIV IND PVT LTD	Bus	27/06/2025	Active	Yes	Alligned	
5-August-2025	Devanhalli	KA03AN6654	AUTOLIV IND PVT LTD	Bus	07/07/2025	Active	Yes	Alligned	
5-August-2025	Devanhalli	KA01AQ0236	AUTOLIV IND PVT LTD	Bus	07/07/2025	Active	Yes	Alligned	
5-August-2025	Devanhalli	KA03AN6572	AUTOLIV IND PVT LTD	Bus	07/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN7645	CARMEL CONVENT	Bus	27/05/2025	Active	Yes	Alligned	Offline since 3 days
5-August-2025	Bangalore	RYN-65611	Carmel Teresa	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2604	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2693	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2511	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2512	CHENNAI ONE TCS	Bus	16/06/2025	Offlline >24Hrs	NA	NA	Offline since 29 days
5-August-2025	Chennai	TN02CD2524	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2577	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2610	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2670	CHENNAI ONE TCS	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2598	CHENNAI ONE TCS	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2622	CHENNAI ONE TCS	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2583	CHENNAI ONE TCS	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2529	CHENNAI ONE TCS	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2630	CHENNAI ONE TCS	Bus	17/06/2025	Offlline >24Hrs	NA	NA	Offline since 4 days
5-August-2025	Chennai	TN02CD2677	CHENNAI ONE TCS	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C3771	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1964	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1966	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1951	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1968	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1960	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AG7448	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1969	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AG7449	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C7179	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C7190	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1962	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1963	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1949	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C7191	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C7162	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1965	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AK1972	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1967	CHRIST SCHOOL KENGERI	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1954	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3151	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3146	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3147	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3145	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA41C3769	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1953	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1958	CHRIST SCHOOL MADIWALA	Bus	17/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3144	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1950	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM3150	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1957	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	Black screen with time stamp
5-August-2025	Bangalore	KA03AM3148	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AJ6058	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51B8315	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AE0490	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AD1471	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AE9880	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AF8972	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AD6771	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AJ6056	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK1959	CHRIST SCHOOL MADIWALA	Bus	18/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA05AG7446	CHRIST SCHOOL MADIWALA	Bus	19/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51B8314	CHRIST SCHOOL MADIWALA	Bus	20/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7581	GIG - BANGLORE	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7572	GIG - BANGLORE	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7575	GIG - BANGLORE	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7574	GIG - BANGLORE	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7571	GIG - BANGLORE	Bus	27/05/2025	Not Active	No	NA	First ignition off
5-August-2025	Bangalore	KA03AN7617	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7591	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7616	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7563	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7592	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7589	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7588	NARAYANA 	Bus	27/05/2025	Not Active	No	NA	First ignition off
5-August-2025	Bangalore	KA03AN7590	NARAYANA 	Bus	27/05/2025	Offlline >24Hrs	NA	NA	Offline since 5 days
5-August-2025	Bangalore	KA03AN7593	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7583	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7587	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7584	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7561	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7650	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7552	NARAYANA 	Bus	27/05/2025	Offlline >24Hrs	NA	NA	Offline since 67 days
5-August-2025	Bangalore	KA03AN7582	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7786	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7573	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7555	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7564	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7731	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7565	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7554	NARAYANA 	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7553	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7560	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7556	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7562	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7557	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7787	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7570	NARAYANA 	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2587	NEWGEN	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Chennai	TN02CD2608	NEWGEN	Bus	16/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN4819	ONE CAMPUS	Bus	23/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN4821	ONE CAMPUS	Bus	06/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6584	ONE CAMPUS	Tempo Traveller	06/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6583	ONE CAMPUS	Tempo Traveller	06/06/2025	Not Active	NA	NA	First ignition off
5-August-2025	Bangalore	KA03AN6585	ONE CAMPUS	Tempo Traveller	06/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7648	PRIMUS	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7651	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7625	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7634	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7623	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7636	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7654	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7637	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7626	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7652	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7628	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	gps issue
5-August-2025	Bangalore	KA03AN7629	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7656	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7638	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7618	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7635	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7639	RYAN School	Bus	28/05/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN7619	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7627	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7643	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7633	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7659	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7632	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7657	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7655	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7624	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7620	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7642	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7641	RYAN School	Bus	28/05/2025	Not Active	NA	NA	First ignition off
5-August-2025	Bangalore	KA03AN7717	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7716	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7725	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7726	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7772	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7724	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7713	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7719	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7723	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7714	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7718	RYAN School	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7776	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7771	RYAN School	Bus	05/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA53C5519	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA53C5528	RYAN School	Bus	05/06/2025	Offlline >24Hrs	NA	NA	Offline since 15 days
5-August-2025	Bangalore	KA03AN7773	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7780	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7715	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7778	RYAN School	Bus	05/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA53C5514	RYAN School	Bus	05/06/2025	Offlline >24Hrs	NA	NA	Offline since 1  days
5-August-2025	Bangalore	KA03AN7770	RYAN School	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7781	RYAN School	Bus	25/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8316	SAP	Car	14/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA51AJ9201	SCHNEIDER	Bus	08/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK2808	Sold	Bus	08/05/2025				Vehicle Sold
5-August-2025	Bangalore	KA51AJ9185	SCHNEIDER	Tempo Traveller	08/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ9196	SCHNEIDER	Bus	23/05/2025	Active	Yes	Alligned	Offline since 1 days
5-August-2025	Bangalore	KA03AN7418	SCHNEIDER	Car	25/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM2448	SCHNEIDER	Bus	06/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ9187	SCHNEIDER	Tempo Traveller	06/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ4350	SCHNEIDER	Bus	06/06/2025	Offlline >24Hrs	NA	NA	Offline since 2 months
5-August-2025	Bangalore	KA03AM2340	SCHNEIDER	Bus	06/06/2025	Not Active	NA	NA	First ignition off
5-August-2025	Bangalore	KA51AJ9181	SCHNEIDER	Tempo Traveller	06/06/2025	Not Active	NA	NA	First ignition off
5-August-2025	Bangalore	KA42A2818	Sold	Bus	09/05/2025				Vehicle Sold
5-August-2025	Bangalore	KA03AN7663	SRI SRI ACADEMY	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7662	SRI SRI ACADEMY	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7660	SRI SRI ACADEMY	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7674	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7674	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7653	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7672	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7673	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7671	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7647	SRI SRI RAVISHANKAR VIDYA MANDIR EAST	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7669	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7670	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7670	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7666	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Not Active	NA	NA	First ignition off
5-August-2025	Bangalore	KA03AN7664	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7665	SRI SRI RAVISHANKAR VIDYA MANDIR NORTH	Bus	27/05/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AJ8415	TASL JIGANI	Tempo Traveller	08/05/2025	Offlline >24Hrs	NA	NA	Offline since 18 days
5-August-2025	Krishnagiri	TN70AV2238	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8677	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2293	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2247	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2254	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2209	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2295	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2287	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2274	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2253	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4965	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2296	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2280	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2291	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2202	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN7023	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2218	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2215	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2275	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2332	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN4853	TEPL	Bus	29/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5702	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AM3332	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS0749	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ5037	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS0761	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AT3159	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5700	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4952	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6422	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6457	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8761	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4919	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4914	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6493	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4987	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4937	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6450	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4939	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6428	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4957	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4933	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4962	TEPL HOSUR	Bus	10/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AT3161	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	GPS timestamp is not coming
5-August-2025	Krishnagiri	TN70AT3172	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9987	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ9276	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6413	TEPL HOSUR	Bus	11/06/2025	Not Active	NA	NA	First ignition off
5-August-2025	Krishnagiri	TN70AQ9280	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9973	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5697	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8620	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4908	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8664	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4936	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4966	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS5836	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ7571	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	GPS ISSUE
5-August-2025	Krishnagiri	TN70AQ4926	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AM3331	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS5860	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9967	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5701	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4948	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8696	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AT3137	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6487	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4980	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6477	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4956	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9905	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ8426	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	GPS timestamp is not coming
5-August-2025	Krishnagiri	TN70AS0727	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6417	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6474	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ5053	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4971	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4947	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4946	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ5064	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4963	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6415	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4912	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS6176	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ5026	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8609	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AT3109	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6436	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2280	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ5058	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4928	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5698	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ8425	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8635	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ5699	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9914	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8640	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6464	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8689	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AU9952	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4942	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2335	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AR6063	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2277	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ8601	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6418	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6439	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ6411	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AQ4991	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS0745	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA51AJ4362	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AS5850	TEPL HOSUR	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Echanahalli	TN70AQ4950	TEPL HOSUR	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2283	TEPL JASMINE	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2326	TEPL JASMINE	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN6660	TEPL JASMINE	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2265	TEPL JASMINE	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN7021	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN7022	TEPL JASMINE	Bus	12/06/2025	Offlline >24Hrs	NA	NA	Offlince since  20  days
5-August-2025	Krishnagiri	TN70AV2219	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2236	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2241	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2245	TEPL JASMINE	Bus	12/06/2025	Offlline >24Hrs	NA	NA	Offline since 35 days
5-August-2025	Krishnagiri	TN70AV2217	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV2257	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN2333	TEPL JASMINE	Bus	12/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	KA03AN4817	TESS NARASAPURA	Bus	11/06/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7204	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 48  days
5-August-2025	Kolar	KA03AN7210	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 20 day
5-August-2025	Kolar	KA03AN7356	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 33 days
5-August-2025	Kolar	KA03AN7205	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 3 days
5-August-2025	Kolar	KA03AN7413	VOLVO	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7201	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 27 days
5-August-2025	Kolar	KA03AN7209	VOLVO	Bus	28/05/2025	Active	Yes	Misalligned	
5-August-2025	Kolar	KA03AN7205	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 3 days
5-August-2025	Kolar	KA03AN7412	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 31 days
5-August-2025	Kolar	KA03AN7213	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offline since 6 days
5-August-2025	Kolar	KA03AN7416	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	Offlince since  24  days
5-August-2025	Kolar	KA03AN7355	VOLVO	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7212	VOLVO	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7206	VOLVO	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7203	VOLVO	Bus	28/05/2025	Active	Yes	Alligned	
5-August-2025	Kolar	KA03AN7211	VOLVO	Bus	05/06/2025	Active	Yes	Misalligned	
5-August-2025	Kolar	KA03AN7551	VOLVO	Bus	05/06/2025	Offlline >24Hrs	NA	NA	Offline since 28  days
5-August-2025	Kolar	INF-KLR-76002	VOLVO	Bus	17/03/2025	Active	Yes	Alligned	
5-August-2025	Kolar	INF-KLR-04408	VOLVO	Bus	17/03/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7419	SCHNEIDER	Car	25/05/2025	Active	Yes	Misalligned	
5-August-2025	Kolar	INF-KLR-2315D	VOLVO	Bus	28/05/2025	Offlline >24Hrs	NA	NA	First ignition off
5-August-2025	Bangalore	KA03AN8860	ICM	Bus	26/06/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN8856	ICM	Bus	26/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8858	ICM	Bus	27/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8857	ICM	Bus	27/06/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8859	ICM	Bus	27/06/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV5680	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  19 days
5-August-2025	Krishnagiri	TN70AV5641	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV5699	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offline since 7 days
5-August-2025	Krishnagiri	TN70AV5612	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TN70AV5664	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  19 days
5-August-2025	Krishnagiri	TN70AV5646	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  2 days
5-August-2025	Krishnagiri	TN70AV5601	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TEPL-J-00997	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  21  days
5-August-2025	Krishnagiri	TEPL-J-00834	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TEPL-J-00867	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  1 month
5-August-2025	Krishnagiri	TEPL-J-00871	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TEPL-J-00998	TEPL JASMINE	Bus	16/07/2025	Active	Yes	Alligned	
5-August-2025	Krishnagiri	TEPL-J-00841	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  22 days
5-August-2025	Krishnagiri	TEPL-J-01645	TEPL JASMINE	Bus	16/07/2025	Offlline >24Hrs	NA	NA	Offlince since  22 days
5-August-2025	Devanhalli	KA01AF0474	Raikon	Bus	27/07/2025	Active	Yes	Alligned	
5-August-2025	Devanhalli	KA01AF2992	Raikon	Bus	27/07/2025	Active	Yes	Alligned	
5-August-2025	Devanhalli	KA01AF4762	Raikon	Bus	27/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AM5438	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7879	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA51AA4842	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN8723	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA53D3273	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA02AN8722	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA02AN7878	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA02AN7769	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA02AN8717	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA02AN8716	Narayana	Bus	29/07/2025	Not Active	No	NA	First ignition off
5-August-2025	Bangalore	KA51AH9547	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN8712	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN8724	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN8725	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	
5-August-2025	Bangalore	KA03AN8721	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7877	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN7768	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA07A5308	Narayana	Bus	29/07/2025	Active	Yes	Misalligned	Black screen with time stamp
5-August-2025	Bangalore	KA03AN7767	Narayana	Bus	29/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK3778	Intel	Bus	31/07/2025	Offlline >24Hrs	NA	NA	Offline since 2 days
5-August-2025	Bangalore	KA03AK2981	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK3780	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6656	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK3768	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK3782	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6653	Intel	Bus	31/07/2025	Active	Yes	Alligned	GPS issue
5-August-2025	Bangalore	KA03AN6593	Intel	Bus	31/07/2025	Offlline >24Hrs	NA	NA	Offline since 4 months
5-August-2025	Bangalore	KA03AN6657	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6652	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6597	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AN6590	Intel	Bus	31/07/2025	Active	Yes	Alligned	
5-August-2025	Bangalore	KA03AK3767	Intel	Bus	31/07/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA51AH6482	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK2991	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AP0118	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK3760	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA51AH8710	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK3771	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK3772	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AN6594	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK3775	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK3759	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AN6588	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AN6595	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK2984	Intel	Bus	01/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5685	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5684	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5683	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5682	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5686	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5688	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5680	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5681	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AJ5698	Intel	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AM2451	Ryan kanakpura	Bus	03/08/2025	Not Active	NA	NA	
5-August-2025	Bangalore	KA03AK2197	Ryan kanakpura	Bus	03/08/2025	Not Active	NA	NA	
`;

        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Complete Vehicle Dashboard...');
        this.loadConfig();
        this.setupEventListeners();
        this.updateSpeed('Initializing...');
        
        // --- MODIFIED: Use local data instead of API call ---
        this.startLoadingLocalData();
    }
    
    // =================== CONFIGURATION ===================
    
    loadConfig() {
        const config = localStorage.getItem('vehicleDashboardConfig');
        if (config) {
            const parsed = JSON.parse(config);
            this.apiKey = parsed.apiKey || '';
            this.sheetId = parsed.sheetId || '1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg';
            this.ranges = parsed.ranges || [];
            
            // Update form fields
            document.getElementById('apiKey').value = this.apiKey;
            document.getElementById('sheetId').value = this.sheetId;
            document.getElementById('ranges').value = this.ranges.length > 0 ? this.ranges.join(',') : 'Leave empty for auto-detection';
        } else {
            // Set defaults for first time
            this.sheetId = '1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg';
            this.ranges = [];
            document.getElementById('sheetId').value = this.sheetId;
            document.getElementById('ranges').value = 'Leave empty for auto-detection';
        }
    }
    
    saveConfig() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const sheetId = document.getElementById('sheetId').value.trim();
        const rangesText = document.getElementById('ranges').value.trim();
        
        if (!apiKey || !sheetId) {
            this.showError('Please enter both API Key and Sheet ID');
            return;
        }
        
        this.apiKey = apiKey;
        this.sheetId = sheetId;
        
        // Handle ranges - empty means auto-detection
        if (rangesText && rangesText !== 'Leave empty for auto-detection') {
            this.ranges = rangesText.split(',').map(r => r.trim());
        } else {
            this.ranges = []; // Empty means auto-detect
        }
        
        const config = {
            apiKey: this.apiKey,
            sheetId: this.sheetId,
            ranges: this.ranges
        };
        
        localStorage.setItem('vehicleDashboardConfig', JSON.stringify(config));
        
        this.hideConfigModal();
        this.startLoading();
    }
    
    showConfigModal() {
        document.getElementById('configModal').style.display = 'flex';
    }
    
    hideConfigModal() {
        document.getElementById('configModal').style.display = 'none';
    }

    // --- ADDED: New function to handle local data loading ---
    startLoadingLocalData() {
        this.showLoadingOverlay();
        this.updateLoadingStatus('Processing local data...');
        setTimeout(() => {
            const data = this.processLocalData();
            this.updateLoadingStatus('Rendering dashboard...');
            this.updateDashboard(data);
            this.hideLoadingOverlay();
            this.updateSpeed();
        }, 1000);
    }
    
    // =================== GOOGLE SHEETS API ===================
    
    // --- MODIFIED: This function is no longer called in init() ---
    async fetchSheetData() {
        if (!this.apiKey || !this.sheetId) {
            throw new Error('API Key and Sheet ID are required');
        }
        
        try {
            this.updateLoadingStatus('Connecting to Google Sheets...');
            
            // First, get all sheet names automatically
            const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}?key=${this.apiKey}`;
            const metadataResponse = await fetch(metadataUrl);
            
            if (!metadataResponse.ok) {
                throw new Error('Failed to fetch sheet metadata');
            }
            
            const metadata = await metadataResponse.json();
            const allSheets = metadata.sheets || [];
            
            // Auto-detected ranges with better filtering for daily tabs
            const autoRanges = allSheets
                .filter(sheet => {
                    const name = sheet.properties.title.toLowerCase();
                    // Filter only daily tabs (ignore any other sheets)
                    return /\d+(st|nd|rd|th)\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(name) ||
                           /\d+\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(name);
                })
                .map(sheet => `${sheet.properties.title}!A:J`);
            
            const sheetNames = allSheets.map(s => s.properties.title).filter(name => {
                const nameLower = name.toLowerCase();
                return /\d+(st|nd|rd|th)\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(nameLower) ||
                       /\d+\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(nameLower);
            });
            
            console.log('🔍 Auto-detected daily sheets:', sheetNames);
            console.log('📊 Total sheets found:', sheetNames.length);
            
            // Use auto-detected ranges or fallback to user-provided ranges
            const rangesToUse = autoRanges.length > 0 ? autoRanges : this.ranges;
            
            this.updateLoadingStatus(`Processing ${sheetNames.length} daily tabs...`);
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values:batchGet?ranges=${rangesToUse.join('&ranges=')}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Google Sheets API Error: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Google Sheets data fetched successfully');
            
            // Store sheet metadata for processing
            this.sheetMetadata = allSheets;
            
            return this.processSheetData(data);
            
        } catch (error) {
            console.error('❌ Error fetching sheet data:', error);
            throw error;
        }
    }
    
    // --- ADDED: New function to process local data ---
    processLocalData() {
        this.updateLoadingStatus('Processing vehicle data...');
        
        const allVehicles = [];
        let activeVehicles = {};
        let offlineVehicles = {};
        let alignmentTimelines = {};
        let monthlyData = {};
        let clientAnalysis = {};
        let cityAnalysis = {};
        let latestDate = '';
        let latestDateSortKey = '';
        
        const COLUMNS = {
            date: 0,
            location: 1,
            vehicle: 2,
            client: 3,
            type: 4,
            installation: 5,
            status: 6,
            recording: 7,
            alignment: 8,
            remarks: 9
        };

        const cleanText = (text) => {
            if (!text) return '';
            return text.toString()
                .replace(/\*\*/g, '')
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s+/g, ' ');
        };

        const formatDate = (dateInput) => {
            try {
                const dateStr = dateInput.toString();
                const tabDateMatch = dateStr.match(/(\d+)(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
                if (tabDateMatch) {
                    const day = tabDateMatch[1];
                    const month = tabDateMatch[3];
                    return day + ' ' + month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
                }
                if (dateStr.includes('-')) {
                    const parts = dateStr.split('-');
                    if (parts.length >= 2) {
                        return parts[0] + ' ' + parts[1];
                    }
                }
                if (dateInput instanceof Date) {
                    const day = dateInput.getDate();
                    const month = dateInput.toLocaleString('en-US', { month: 'long' });
                    return day + ' ' + month;
                }
                const dayMatch = dateStr.match(/\d+/);
                const monthMatch = dateStr.match(/january|february|march|april|may|june|july|august|september|october|november|december/i);
                if (dayMatch && monthMatch) {
                    return dayMatch[0] + ' ' + monthMatch[0];
                }
                return dateStr.replace(/[^\w\s]/g, '').trim();
            } catch (error) {
                return dateInput.toString();
            }
        };

        const getDateSortKey = (dateStr) => {
            try {
                const parts = dateStr.split(' ');
                if (parts.length >= 2) {
                    const day = parseInt(parts[0]) || 0;
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthIndex = monthNames.indexOf(parts[1]) + 1 || 0;
                    return monthIndex.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
                }
                return dateStr;
            } catch (error) {
                return dateStr;
            }
        };

        const getMonth = (sheetName, dateStr) => {
            const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
            const tabLower = sheetName.toLowerCase();
            const dateLower = dateStr.toLowerCase();
            for (let month of months) {
                if (tabLower.includes(month) || dateLower.includes(month)) {
                    return month;
                }
            }
            return 'unknown';
        };

        const rows = this.localDataString.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        const headers = rows[0].split('\t').map(header => cleanText(header));
        const dataRows = rows.slice(1);
        
        let headerMap = {};
        headers.forEach((header, index) => {
            if (header.includes('Date')) headerMap.date = index;
            if (header.includes('Location')) headerMap.location = index;
            if (header.includes('Vehicle Number')) headerMap.vehicle = index;
            if (header.includes('Client Name')) headerMap.client = index;
            if (header.includes('Vehicle Type')) headerMap.type = index;
            if (header.includes('Working Status')) headerMap.status = index;
            if (header.includes('Recording')) headerMap.recording = index;
            if (header.includes('Allignmnent')) headerMap.alignment = index;
        });

        const sheetName = '9-July-2025';

        dataRows.forEach(rowString => {
            const row = rowString.split('\t').map(cell => cleanText(cell));
            if (row.length > 1 && row[headerMap.vehicle]) {
                const vehicle = {
                    date: cleanText(row[headerMap.date]),
                    location: cleanText(row[headerMap.location]),
                    vehicle: cleanText(row[headerMap.vehicle]),
                    client: cleanText(row[headerMap.client]),
                    type: cleanText(row[headerMap.type]),
                    status: cleanText(row[headerMap.status]),
                    recording: cleanText(row[headerMap.recording]),
                    alignment: cleanText(row[headerMap.alignment]),
                    sheet: sheetName
                };

                const sortKey = getDateSortKey(vehicle.date);
                if (sortKey > latestDateSortKey) {
                    latestDateSortKey = sortKey;
                    latestDate = formatDate(vehicle.date);
                }

                allVehicles.push(vehicle);

                const month = getMonth(sheetName, vehicle.date);
                if (!monthlyData[month]) {
                    monthlyData[month] = { total: 0, active: 0, offline: 0, misaligned: 0, aligned: 0 };
                }
                if (vehicle.status && vehicle.status.toLowerCase() === 'active') {
                    monthlyData[month].active++;
                } else {
                    monthlyData[month].offline++;
                }
                if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'alligned') {
                    monthlyData[month].aligned++;
                } else if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'not alligned') {
                    monthlyData[month].misaligned++;
                }
                monthlyData[month].total++;

                if (sortKey === latestDateSortKey) {
                    if (!clientAnalysis[vehicle.client]) {
                        clientAnalysis[vehicle.client] = {
                            total: 0,
                            active: 0,
                            offline: 0,
                            aligned: 0,
                            misaligned: 0,
                            vehicles: []
                        };
                    }
                    clientAnalysis[vehicle.client].total++;
                    if (vehicle.status && vehicle.status.toLowerCase() === 'active') {
                        clientAnalysis[vehicle.client].active++;
                    } else {
                        clientAnalysis[vehicle.client].offline++;
                    }
                    if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'alligned') {
                        clientAnalysis[vehicle.client].aligned++;
                    } else if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'not alligned') {
                        clientAnalysis[vehicle.client].misaligned++;
                    }
                    clientAnalysis[vehicle.client].vehicles.push(vehicle);

                    if (!cityAnalysis[vehicle.location]) {
                        cityAnalysis[vehicle.location] = {
                            total: 0,
                            active: 0,
                            offline: 0,
                            aligned: 0,
                            misaligned: 0,
                            vehicles: []
                        };
                    }
                    cityAnalysis[vehicle.location].total++;
                    if (vehicle.status && vehicle.status.toLowerCase() === 'active') {
                        cityAnalysis[vehicle.location].active++;
                    } else {
                        cityAnalysis[vehicle.location].offline++;
                    }
                    if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'alligned') {
                        cityAnalysis[vehicle.location].aligned++;
                    } else if (vehicle.alignment && vehicle.alignment.toLowerCase() === 'not alligned') {
                        cityAnalysis[vehicle.location].misaligned++;
                    }
                    cityAnalysis[vehicle.location].vehicles.push(vehicle);
                }
            }
        });
        
        return { allVehicles, activeVehicles, offlineVehicles, monthlyData, clientAnalysis, cityAnalysis, latestDate };
    }

    processSheetData(apiResponse) {
        this.updateLoadingStatus('Processing vehicle data...');
        
        const allVehicles = [];
        let activeVehicles = {};        // Track active vehicles by month
        let offlineVehicles = {};       // Track offline vehicles by month  
        let alignmentTimelines = {};    // Track alignment changes by month
        let monthlyData = {};           // Track all months found
        let clientAnalysis = {};        // Track vehicles by client (latest date only)
        let cityAnalysis = {};          // Track vehicles by city (latest date only)
        let latestDate = '';            // Track the most recent date found
        let latestDateSortKey = '';
        
        // Column mapping (same as original script)
        const COLUMNS = {
            date: 0,        // Column A
            location: 1,    // Column B  
            vehicle: 2,     // Column C
            client: 3,      // Column D
            type: 4,        // Column E
            installation: 5, // Column F
            status: 6,      // Column G (Working Status)
            recording: 7,   // Column H
            alignment: 8,   // Column I (Alignment Status)
            remarks: 9      // Column J
        };
        
        
        
        // UTILITY FUNCTIONS - Exact same as original .gs script
        const cleanText = (text) => {
            if (!text) return '';
            return text.toString()
                .replace(/\*\*/g, '')
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s+/g, ' ');
        };
        
        const formatDate = (dateInput) => {
            try {
                const dateStr = dateInput.toString();
                
                // Handle tab names like "26th July", "1st August"
                const tabDateMatch = dateStr.match(/(\d+)(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
                if (tabDateMatch) {
                    const day = tabDateMatch[1];
                    const month = tabDateMatch[3];
                    return day + ' ' + month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
                }
                
                if (dateStr.includes('-')) {
                    const parts = dateStr.split('-');
                    if (parts.length >= 2) {
                        return parts[0] + ' ' + parts[1];
                    }
                }
                
                if (dateInput instanceof Date) {
                    const day = dateInput.getDate();
                    const month = dateInput.toLocaleString('en-US', { month: 'long' });
                    return day + ' ' + month;
                }
                
                const dayMatch = dateStr.match(/\d+/);
                const monthMatch = dateStr.match(/january|february|march|april|may|june|july|august|september|october|november|december/i);
                
                if (dayMatch && monthMatch) {
                    return dayMatch[0] + ' ' + monthMatch[0];
                }
                
                return dateStr.replace(/[^\w\s]/g, '').trim();
                
            } catch (error) {
                return dateInput.toString();
            }
        };
        
        const getDateSortKey = (dateStr) => {
            try {
                const parts = dateStr.split(' ');
                if (parts.length >= 2) {
                    const day = parseInt(parts[0]) || 0;
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                       'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthIndex = monthNames.indexOf(parts[1]) + 1 || 0;
                    return monthIndex.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
                }
                return dateStr;
            } catch (error) {
                return dateStr;
            }
        };
        
        const getMonth = (sheetName, dateStr) => {
            const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                           'july', 'august', 'september', 'october', 'november', 'december'];
            
            const tabLower = sheetName.toLowerCase();
            const dateLower = dateStr.toLowerCase();
            
            // Handle daily tabs like "26th July", "1st August", etc.
            for (let month of months) {
                if (tabLower.includes(month) || dateLower.includes(month)) {
                    return month.charAt(0).toUpperCase() + month.slice(1);
                }
            }
            
            // Enhanced month detection from tab names
            if (tabLower.includes('july') || tabLower.includes('jul')) return 'July';
            if (tabLower.includes('august') || tabLower.includes('aug')) return 'August';
            if (tabLower.includes('september') || tabLower.includes('sep')) return 'September';
            if (tabLower.includes('october') || tabLower.includes('oct')) return 'October';
            if (tabLower.includes('november') || tabLower.includes('nov')) return 'November';
            if (tabLower.includes('december') || tabLower.includes('dec')) return 'December';
            if (tabLower.includes('january') || tabLower.includes('jan')) return 'January';
            if (tabLower.includes('february') || tabLower.includes('feb')) return 'February';
            if (tabLower.includes('march') || tabLower.includes('mar')) return 'March';
            if (tabLower.includes('april') || tabLower.includes('apr')) return 'April';
            if (tabLower.includes('may')) return 'May';
            if (tabLower.includes('june') || tabLower.includes('jun')) return 'June';
            
            // Try to extract month from date string in the sheet
            const dateMatch = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
            if (dateMatch) {
                return dateMatch[1].charAt(0).toUpperCase() + dateMatch[1].slice(1).toLowerCase();
            }
            
            // Try to extract month from numbers in date
            const numericMatch = dateStr.match(/\b(0?[1-9]|1[0-2])\b/);
            if (numericMatch) {
                const monthNum = parseInt(numericMatch[1]);
                const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                if (monthNum >= 1 && monthNum <= 12) {
                    return monthNames[monthNum];
                }
            }
            
            return 'Unknown';
        };
        
        // Add alignment timeline creation function (exact same as .gs script)
        const createAlignmentTimeline = (vehicleData) => {
            if (!vehicleData || vehicleData.length === 0) return 'No alignment data';
            
            // Sort chronologically
            vehicleData.sort(function(a, b) {
                return getDateSortKey(a.date).localeCompare(getDateSortKey(b.date));
            });
            
            var timeline = [];
            var currentStatus = '';
            var startDate = '';
            var endDate = '';
            
            for (var i = 0; i < vehicleData.length; i++) {
                var entry = vehicleData[i];
                var status = entry.alignmentStatus;
                
                // Skip if no proper alignment status
                if (!status || status === 'Unknown' || status === 'NA') continue;
                
                if (status !== currentStatus) {
                    // Save previous status period
                    if (currentStatus && startDate) {
                        var period = startDate === endDate ? startDate : startDate + ' to ' + endDate;
                        timeline.push(currentStatus + ' (' + period + ')');
                    }
                    
                    // Start new status period
                    currentStatus = status;
                    startDate = entry.date;
                    endDate = entry.date;
                } else {
                    // Continue current status period
                    endDate = entry.date;
                }
            }
            
            // Add final status period
            if (currentStatus && startDate) {
                var period = startDate === endDate ? startDate : startDate + ' to ' + endDate;
                timeline.push(currentStatus + ' (' + period + ')');
            }
            
            return timeline.length > 0 ? timeline.join(' → ') : 'No alignment changes';
        };
        
        // First pass: Find latest date
        apiResponse.valueRanges.forEach((range, sheetIndex) => {
            if (!range.values || range.values.length < 2) return;
            
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                const date = row[COLUMNS.date];
                
                if (date) {
                    const formattedDate = formatDate(date);
                    const sortKey = getDateSortKey(formattedDate);
                    if (sortKey > latestDateSortKey) {
                        latestDateSortKey = sortKey;
                        latestDate = formattedDate;
                    }
                }
            }
        });
        
        console.log(`📅 Latest date found: ${latestDate} (Sort key: ${latestDateSortKey})`);
        
        if (!latestDate) {
            console.log('⚠️ No latest date found, using current month approach');
            latestDate = 'Current';
        }
        
        // Second pass: Process all data
        apiResponse.valueRanges.forEach((range, sheetIndex) => {
            if (!range.values || range.values.length < 2) return;
            
            // Get actual sheet name from metadata or use generic name
            const sheetName = this.sheetMetadata && this.sheetMetadata[sheetIndex] 
                ? this.sheetMetadata[sheetIndex].properties.title 
                : `Sheet${sheetIndex + 1}`;
            
            console.log(`🔄 Processing ${sheetName}...`);
            
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                
                const date = row[COLUMNS.date];
                const vehicleNumber = cleanText(row[COLUMNS.vehicle]);
                const workingStatus = row[COLUMNS.status];
                const alignmentStatus = row[COLUMNS.alignment];
                const clientName = cleanText(row[COLUMNS.client]);
                const location = cleanText(row[COLUMNS.location]);
                const vehicleType = cleanText(row[COLUMNS.type]) || 'Bus';
                const installationDate = row[COLUMNS.installation];
                const recording = cleanText(row[COLUMNS.recording]);
                const remarks = cleanText(row[COLUMNS.remarks]);
                
                if (!date || !vehicleNumber || !workingStatus) continue;
                
                // Skip header-like rows with exact same logic as .gs script
                const vehicleLower = vehicleNumber.toLowerCase();
                if (vehicleLower.includes('vehicle') || 
                    vehicleLower.includes('chassis') ||
                    vehicleLower.includes('number') ||
                    vehicleNumber === '' ||
                    vehicleNumber.length < 3) {
                    console.log(`⚠️ Skipping header row ${i}: ${vehicleNumber}`);
                    continue;
                }
                
                const formattedDate = formatDate(date);
                const month = getMonth(sheetName, date.toString());
                
                if (month === 'Unknown') continue;
                
                // Create vehicle object for allVehicles array
                const vehicleObj = {
                    vehicle: vehicleNumber,
                    client: clientName || 'Unknown',
                    location: location || 'Unknown',
                    workingStatus: workingStatus || 'Unknown',
                    alignmentStatus: alignmentStatus || 'Unknown',
                    vehicleType: vehicleType,
                    installationDate: installationDate ? formatDate(installationDate) : 'Unknown',
                    recording: recording || 'Unknown',
                    date: formattedDate,
                    remarks: remarks || '',
                    month: month,
                    sheetName: sheetName
                };
                
                allVehicles.push(vehicleObj);
                
                // Initialize month tracking - same as .gs script
                if (!monthlyData[month]) {
                    monthlyData[month] = new Set();
                    activeVehicles[month] = {};
                    offlineVehicles[month] = {};
                    alignmentTimelines[month] = {};
                }
                monthlyData[month].add(vehicleNumber);
                
                // TRACK ACTIVE VEHICLES - exact same logic
                if (!activeVehicles[month][vehicleNumber]) {
                    activeVehicles[month][vehicleNumber] = {
                        allActive: true,
                        statuses: []
                    };
                }
                
                activeVehicles[month][vehicleNumber].statuses.push({
                    date: formattedDate,
                    status: workingStatus
                });
                
                // Mark as not consistently active if any non-Active status
                if (workingStatus !== 'Active') {
                    activeVehicles[month][vehicleNumber].allActive = false;
                }
                
                // TRACK OFFLINE VEHICLES - exact same logic
                if (workingStatus === 'Offlline >24Hrs') {
                    if (!offlineVehicles[month][vehicleNumber]) {
                        offlineVehicles[month][vehicleNumber] = {
                            dates: [],
                            latestRemarks: ''
                        };
                    }
                    
                    offlineVehicles[month][vehicleNumber].dates.push(formattedDate);
                    offlineVehicles[month][vehicleNumber].latestRemarks = remarks || 'Offline';
                }
                
                // TRACK ALIGNMENT TIMELINE - exact same logic
                if (alignmentStatus && (alignmentStatus === 'Misalligned' || alignmentStatus === 'Alligned')) {
                    if (!alignmentTimelines[month][vehicleNumber]) {
                        alignmentTimelines[month][vehicleNumber] = [];
                    }
                    
                    alignmentTimelines[month][vehicleNumber].push({
                        date: formattedDate,
                        alignmentStatus: alignmentStatus,
                        remarks: remarks || ''
                    });
                }
                
                // PROCESS CLIENT & CITY ANALYSIS DATA - exact same logic as .gs script
                let shouldCollectForAnalysis = false;
                
                if (latestDate === 'Current') {
                    shouldCollectForAnalysis = true;
                } else {
                    shouldCollectForAnalysis = (formattedDate === latestDate) || 
                                              (getDateSortKey(formattedDate) === latestDateSortKey);
                }
                
                if (shouldCollectForAnalysis) {
                    // CLIENT ANALYSIS - exact same filtering logic
                    if (clientName && 
                        clientName.length > 0 && 
                        clientName !== '#N/A' && 
                        clientName !== 'NA' &&
                        !clientName.toLowerCase().includes('client name') &&
                        !clientName.toLowerCase().includes('vehicle number')) {
                        
                        if (!clientAnalysis[clientName]) {
                            clientAnalysis[clientName] = [];
                        }
                        
                        // Check if this vehicle already exists for this client (avoid duplicates)
                        const existingVehicle = clientAnalysis[clientName].find(function(v) {
                            return v.vehicle === vehicleNumber;
                        });
                        
                        if (!existingVehicle) {
                            clientAnalysis[clientName].push({
                                vehicle: vehicleNumber,
                                workingStatus: workingStatus,
                                alignmentStatus: alignmentStatus || 'Unknown',
                                location: location || 'Unknown',
                                remarks: remarks || '',
                                date: formattedDate
                            });
                        }
                    }
                    
                    // CITY ANALYSIS - exact same filtering logic
                    if (location && 
                        location.length > 0 && 
                        location !== '#N/A' && 
                        location !== 'NA' &&
                        !location.toLowerCase().includes('location') &&
                        !location.toLowerCase().includes('site') &&
                        !location.toLowerCase().includes('vehicle number')) {
                        
                        if (!cityAnalysis[location]) {
                            cityAnalysis[location] = [];
                        }
                        
                        // Check if this vehicle already exists for this city (avoid duplicates)
                        const existingVehicle = cityAnalysis[location].find(function(v) {
                            return v.vehicle === vehicleNumber;
                        });
                        
                        if (!existingVehicle) {
                            cityAnalysis[location].push({
                                vehicle: vehicleNumber,
                                workingStatus: workingStatus,
                                alignmentStatus: alignmentStatus || 'Unknown',
                                client: clientName || 'Unknown',
                                remarks: remarks || '',
                                date: formattedDate
                            });
                        }
                    }
                }
            }
        });
        
        console.log('📊 Processing completed:');
        console.log(`👥 Clients found: ${Object.keys(clientAnalysis).length}`);
        console.log(`🏙️ Cities found: ${Object.keys(cityAnalysis).length}`);
        console.log(`🚗 Total vehicles: ${allVehicles.length}`);
        console.log('📅 Monthly breakdown:');
        Object.keys(monthlyData).forEach(month => {
            const vehicles = Array.from(monthlyData[month]);
            console.log(`  ${month}: ${vehicles.length} unique vehicles`);
        });
        
        // Generate .gs script data structures
        const gsScriptData = {
            // Monthly breakdown data (exact same as .gs script)
            monthlyAnalysis: this.generateMonthlyAnalysisData(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, createAlignmentTimeline),
            
            // Client analysis (exact same format as .gs script)
            clientAnalysisTable: this.generateClientAnalysisTable(clientAnalysis, latestDate),
            
            // City analysis (exact same format as .gs script)  
            cityAnalysisTable: this.generateCityAnalysisTable(cityAnalysis, latestDate),
            
            // Comprehensive summary (exact same as .gs script)
            comprehensiveSummary: this.generateComprehensiveSummary(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, clientAnalysis, cityAnalysis, latestDate)
        };
        
        // Calculate statistics
        const stats = {
            totalVehicles: allVehicles.length,
            activeVehicles: allVehicles.filter(v => v.workingStatus === 'Active').length,
            offlineVehicles: allVehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline')).length,
            alignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Alligned').length,
            misalignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Misalligned').length,
            totalClients: Object.keys(clientAnalysis).length,
            totalLocations: Object.keys(cityAnalysis).length
        };
        
        stats.healthScore = Math.round(((stats.activeVehicles + stats.alignedVehicles) / (stats.totalVehicles * 2)) * 100) || 0;
        
        return {
            stats,
            allVehicles,
            monthlyData,
            clientAnalysis,
            cityAnalysis,
            latestDate,
            gsScriptData,
            lastUpdated: new Date().toLocaleString()
        };
    }
    
    // =================== .GS SCRIPT DATA GENERATORS - EXACT SAME LOGIC ===================
    
    generateMonthlyAnalysisData(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, createAlignmentTimeline) {
        const monthlyAnalysis = {};
        const months = Object.keys(monthlyData).sort();
        
        months.forEach(month => {
            // 🟢 ACTIVE VEHICLES (exact same logic as .gs script)
            const monthActiveVehicles = [];
            Object.keys(activeVehicles[month] || {}).forEach(function(vehicle) {
                if (activeVehicles[month][vehicle].allActive && activeVehicles[month][vehicle].statuses.length > 0) {
                    monthActiveVehicles.push({
                        vehicle: vehicle,
                        status: `Active in ALL ${month} tabs`
                    });
                }
            });
            monthActiveVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            // 🔴 OFFLINE VEHICLES (exact same logic as .gs script)
            const monthOfflineVehicles = [];
            Object.keys(offlineVehicles[month] || {}).forEach(function(vehicle) {
                const vehicleData = offlineVehicles[month][vehicle];
                if (vehicleData.dates.length > 0) {
                    // Remove duplicates and sort
                    const uniqueDates = [];
                    vehicleData.dates.forEach(function(date) {
                        if (uniqueDates.indexOf(date) === -1) {
                            uniqueDates.push(date);
                        }
                    });
                    
                    uniqueDates.sort(function(a, b) {
                        const getDateSortKey = (dateStr) => {
                            try {
                                const parts = dateStr.split(' ');
                                if (parts.length >= 2) {
                                    const day = parseInt(parts[0]) || 0;
                                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                                       'July', 'August', 'September', 'October', 'November', 'December'];
                                    const monthIndex = monthNames.indexOf(parts[1]) + 1 || 0;
                                    return monthIndex.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
                                }
                                return dateStr;
                            } catch (error) {
                                return dateStr;
                            }
                        };
                        return getDateSortKey(a).localeCompare(getDateSortKey(b));
                    });
                    
                    monthOfflineVehicles.push({
                        vehicle: vehicle,
                        dates: uniqueDates,
                        remarks: vehicleData.latestRemarks
                    });
                }
            });
            monthOfflineVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            // ⚖️ ALIGNMENT TIMELINE (exact same logic as .gs script)
            const monthAlignmentVehicles = [];
            Object.keys(alignmentTimelines[month] || {}).forEach(function(vehicle) {
                const vehicleData = alignmentTimelines[month][vehicle];
                if (vehicleData.length > 0) {
                    const timeline = createAlignmentTimeline(vehicleData);
                    const latestEntry = vehicleData[vehicleData.length - 1];
                    
                    monthAlignmentVehicles.push({
                        vehicle: vehicle,
                        timeline: timeline,
                        latestStatus: latestEntry.alignmentStatus,
                        remarks: latestEntry.remarks
                    });
                }
            });
            monthAlignmentVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            monthlyAnalysis[month] = {
                activeVehicles: monthActiveVehicles,
                offlineVehicles: monthOfflineVehicles,
                alignmentVehicles: monthAlignmentVehicles
            };
        });
        
        return monthlyAnalysis;
    }
    
    generateClientAnalysisTable(clientAnalysis, latestDate) {
        const clientKeys = Object.keys(clientAnalysis).sort();
        const clientTable = [];
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        
        clientKeys.forEach((clientName, index) => {
            const vehicles = clientAnalysis[clientName];
            
            // Separate problem vehicles (exact same logic as .gs script)
            const problemVehicles = [];
            
            vehicles.forEach(function(v) {
                if (v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned') {
                    problemVehicles.push(v.vehicle + ' (' + v.workingStatus + '/' + v.alignmentStatus + ')');
                }
            });
            
            const allVehicleNumbers = vehicles.map(function(v) { return v.vehicle; }).join(', ');
            const problemVehicleText = problemVehicles.join(', ') || 'None';
            const statusText = problemVehicles.length > 0 ? 
                'ISSUES: ' + problemVehicles.length + '/' + vehicles.length : 
                'ALL OK';
            
            clientTable.push({
                sno: index + 1,
                clientName: clientName,
                vehicleCount: vehicles.length,
                vehicleNumbers: allVehicleNumbers,
                problemVehicles: problemVehicleText,
                status: statusText,
                hasProblems: problemVehicles.length > 0,
                vehicles: vehicles
            });
        });
        
        return {
            displayDate: displayDate,
            data: clientTable
        };
    }
    
    generateCityAnalysisTable(cityAnalysis, latestDate) {
        const cityKeys = Object.keys(cityAnalysis).sort();
        const cityTable = [];
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        
        cityKeys.forEach((cityName, index) => {
            const vehicles = cityAnalysis[cityName];
            
            // Separate problem vehicles (exact same logic as .gs script)
            const problemVehicles = [];
            
            vehicles.forEach(function(v) {
                if (v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned') {
                    problemVehicles.push(v.vehicle + ' (' + v.workingStatus + '/' + v.alignmentStatus + ')');
                }
            });
            
            const allVehicleNumbers = vehicles.map(function(v) { return v.vehicle; }).join(', ');
            const problemVehicleText = problemVehicles.join(', ') || 'None';
            const statusText = problemVehicles.length > 0 ? 
                'ISSUES: ' + problemVehicles.length + '/' + vehicles.length : 
                'ALL OK';
            
            cityTable.push({
                sno: index + 1,
                cityName: cityName,
                vehicleCount: vehicles.length,
                vehicleNumbers: allVehicleNumbers,
                problemVehicles: problemVehicleText,
                status: statusText,
                hasProblems: problemVehicles.length > 0,
                vehicles: vehicles
            });
        });
        
        return {
            displayDate: displayDate,
            data: cityTable
        };
    }
    
    generateComprehensiveSummary(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, clientAnalysis, cityAnalysis, latestDate) {
        const months = Object.keys(monthlyData).sort();
        const monthlyCounts = {};
        
        // Calculate monthly counts (exact same logic as .gs script)
        months.forEach(month => {
            const activeCount = Object.keys(activeVehicles[month] || {}).filter(function(vehicle) {
                return activeVehicles[month][vehicle].allActive && activeVehicles[month][vehicle].statuses.length > 0;
            }).length;
            
            const offlineCount = Object.keys(offlineVehicles[month] || {}).filter(function(vehicle) {
                return offlineVehicles[month][vehicle].dates.length > 0;
            }).length;
            
            const alignmentCount = Object.keys(alignmentTimelines[month] || {}).filter(function(vehicle) {
                return alignmentTimelines[month][vehicle].length > 0;
            }).length;
            
            monthlyCounts[month] = {
                active: activeCount,
                offline: offlineCount,
                alignment: alignmentCount
            };
        });
        
        // Calculate total unique vehicles (exact same logic as .gs script)
        const allVehicles = new Set();
        Object.keys(monthlyData).forEach(function(month) {
            monthlyData[month].forEach(function(vehicle) {
                allVehicles.add(vehicle);
            });
        });
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        
        return {
            monthlyCounts: monthlyCounts,
            totalVehicles: allVehicles.size,
            totalClients: Object.keys(clientAnalysis).length,
            totalCities: Object.keys(cityAnalysis).length,
            dataSourceDate: displayDate
        };
    }
    
    // =================== UI MANAGEMENT ===================
    
    startLoading() {
        this.showLoadingOverlay();
        this.fetchAndRenderData();
    }
    
    showLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    updateLoadingStatus(status) {
        const element = document.getElementById('loadingStatus');
        if (element) {
            element.textContent = status;
        }
    }
    
    updateSpeed(status) {
        const indicator = document.getElementById('speedIndicator');
        const elapsed = (Date.now() - this.loadStartTime) / 1000;
        indicator.innerHTML = `⚡ ${status} (${elapsed.toFixed(1)}s)`;
        
        if (status.includes('Complete')) {
            indicator.style.background = 'var(--success)';
            indicator.style.animation = 'none';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }
    
    showError(message) {
        const errorHtml = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="dashboard.showConfigModal()" style="margin-top: 15px; padding: 10px 20px; background: white; color: #ef4444; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Update Configuration
                </button>
            </div>
        `;
        
        document.getElementById('statsGrid').innerHTML = errorHtml;
        this.hideLoadingOverlay();
    }
    
    // =================== DATA FETCHING & RENDERING ===================
    
    async fetchAndRenderData() {
        try {
            this.loadStartTime = Date.now();
            this.updateSpeed('Loading...');
            
            const data = await this.fetchSheetData();
            this.cache.mainData = data;
            
            this.hideLoadingOverlay();
            this.renderDashboard(data);
            this.updateSpeed('Complete');
            
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            this.hideLoadingOverlay();
            this.showError(error.message);
            this.updateSpeed('Error');
        }
    }
    
    renderDashboard(data) {
        this.renderStats(data);
        this.renderClientList(data);
        this.renderLocationList(data);
        this.renderCharts(data);
        this.updateLastUpdated(data.lastUpdated);
    }
    
    // =================== FAST RENDERING FUNCTIONS ===================
    
    renderStats(data) {
        const stats = data.stats || {};
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card total" onclick="dashboard.showVehicleDetails('total')">
                <div class="stat-icon"><i class="fas fa-cars"></i></div>
                <div class="stat-value">${stats.totalVehicles || 0}</div>
                <div class="stat-label">Total Vehicles</div>
            </div>
            <div class="stat-card active" onclick="dashboard.showVehicleDetails('active')">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-value">${stats.activeVehicles || 0}</div>
                <div class="stat-label">Active Vehicles</div>
            </div>
            <div class="stat-card aligned" onclick="dashboard.showVehicleDetails('aligned')">
                <div class="stat-icon"><i class="fas fa-align-center"></i></div>
                <div class="stat-value">${stats.alignedVehicles || 0}</div>
                <div class="stat-label">Aligned Vehicles</div>
            </div>
            <div class="stat-card misaligned" onclick="dashboard.showVehicleDetails('misaligned')">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="stat-value">${stats.misalignedVehicles || 0}</div>
                <div class="stat-label">Misaligned Vehicles</div>
            </div>
            <div class="stat-card offline" onclick="dashboard.showVehicleDetails('offline')">
                <div class="stat-icon"><i class="fas fa-wifi-slash"></i></div>
                <div class="stat-value">${stats.offlineVehicles || 0}</div>
                <div class="stat-label">Offline 24+ hrs</div>
            </div>
            <div class="stat-card health">
                <div class="stat-icon"><i class="fas fa-heart-pulse"></i></div>
                <div class="stat-value">${stats.healthScore || 0}%</div>
                <div class="stat-label">Health Score</div>
            </div>
        `;
    }
    
    renderClientList(data, showIssuesOnly = false) {
        const clientAnalysis = data.clientAnalysis || {};
        const clients = Object.keys(clientAnalysis).sort().slice(0, 15);
        
        let filteredClients = clients;
        if (showIssuesOnly) {
            filteredClients = clients.filter(clientName => {
                const vehicles = clientAnalysis[clientName];
                return vehicles.some(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned');
            });
        }
        
        const html = filteredClients.map(clientName => {
            const vehicles = clientAnalysis[clientName];
            const problemCount = vehicles.filter(v => 
                v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
            ).length;
            
            const hasProblems = problemCount > 0;
            const problemText = hasProblems ? ` (${problemCount} issues)` : '';
            const classString = hasProblems ? 'list-item has-issues' : 'list-item';
            
            return `
                <div class="${classString}" onclick="dashboard.showClientDetails('${clientName}')">
                    <span class="item-name">
                        <i class="fas ${hasProblems ? 'fa-exclamation-triangle' : 'fa-building'}"></i> 
                        ${clientName}${problemText}
                    </span>
                    <span class="item-count">${vehicles.length}</span>
                </div>
            `;
        }).join('');
        
        document.getElementById('clientList').innerHTML = html;
    }
    
    renderLocationList(data, showIssuesOnly = false) {
        const locationAnalysis = data.cityAnalysis || {};
        const locations = Object.keys(locationAnalysis).sort().slice(0, 15);
        
        let filteredLocations = locations;
        if (showIssuesOnly) {
            filteredLocations = locations.filter(locationName => {
                const vehicles = locationAnalysis[locationName];
                return vehicles.some(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned');
            });
        }
        
        const html = filteredLocations.map(locationName => {
            const vehicles = locationAnalysis[locationName];
            const problemCount = vehicles.filter(v => 
                v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
            ).length;
            
            const hasProblems = problemCount > 0;
            const problemText = hasProblems ? ` (${problemCount} issues)` : '';
            const classString = hasProblems ? 'list-item has-issues' : 'list-item';
            
            return `
                <div class="${classString}" onclick="dashboard.showLocationDetails('${locationName}')">
                    <span class="item-name">
                        <i class="fas ${hasProblems ? 'fa-exclamation-triangle' : 'fa-map-marker-alt'}"></i> 
                        ${locationName}${problemText}
                    </span>
                    <span class="item-count">${vehicles.length}</span>
                </div>
            `;
        }).join('');
        
        document.getElementById('locationList').innerHTML = html;
    }
    
    renderCharts(data) {
        this.renderIssuesChart(data);
        this.renderStatusChart(data);
    }
    
    renderIssuesChart(data) {
        const ctx = document.getElementById('heatmapChart');
        if (!ctx) return;

        if (this.charts.heatmap) this.charts.heatmap.destroy();

        // Generate current month issues data
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
        const currentMonthVehicles = data.allVehicles.filter(v => v.month === currentMonth);
        
        // Group by date and count issues
        const dailyIssues = {};
        currentMonthVehicles.forEach(vehicle => {
            const date = vehicle.date;
            if (!dailyIssues[date]) {
                dailyIssues[date] = 0;
            }
            
            // Count misalignment and offline issues
            if (vehicle.alignmentStatus === 'Misalligned') {
                dailyIssues[date]++;
            }
            if (vehicle.workingStatus === 'Offlline >24Hrs') {
                dailyIssues[date]++;
            }
        });
        
        const labels = Object.keys(dailyIssues).sort().slice(-7); // Last 7 days
        const issueData = labels.map(date => dailyIssues[date] || 0);
        
        this.charts.heatmap = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Issues',
                    data: issueData,
                    backgroundColor: issueData.map(value => {
                        if (value > 5) return '#ef4444';
                        if (value > 2) return '#f59e0b';
                        return '#10b981';
                    }),
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return `Date: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `Issues: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: { 
                    y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { 
                            color: '#94a3b8',
                            stepSize: 1
                        },
                        title: {
                            display: true,
                            text: 'Number of Issues',
                            color: '#94a3b8',
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { 
                            color: '#94a3b8',
                            font: { size: 11 }
                        },
                        title: {
                            display: true,
                            text: 'Dates',
                            color: '#94a3b8',
                            font: { size: 12 }
                        }
                    }
                },
                animation: { duration: 800, easing: 'easeOutQuart' },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        });
    }
    
    renderStatusChart(data) {
        const ctx = document.getElementById('clientStatusChart');
        if (!ctx) return;

        if (this.charts.clientStatus) this.charts.clientStatus.destroy();

        // Calculate client status distribution
        const clientAnalysis = data.clientAnalysis || {};
        let allOK = 0;
        let hasIssues = 0;
        
        Object.keys(clientAnalysis).forEach(clientName => {
            const vehicles = clientAnalysis[clientName];
            const problemCount = vehicles.filter(v => 
                v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
            ).length;
            
            if (problemCount > 0) {
                hasIssues++;
            } else {
                allOK++;
            }
        });

        const statusData = { 'All OK': allOK, 'Has Issues': hasIssues };
        const labels = Object.keys(statusData);
        const chartData = Object.values(statusData);

        this.charts.clientStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: chartData,
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            font: { size: 12, weight: 'bold' },
                            color: '#e2e8f0',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }
    
    updateLastUpdated(lastUpdated) {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.innerHTML = `<i class="fas fa-clock"></i> ${lastUpdated}`;
        }
    }
    
    // =================== TAB SWITCHING & LOADING ===================
    
    switchTab(tabIndex) {
        // Instant UI switch
        document.querySelectorAll('.tab').forEach((tab, index) => {
            tab.classList.toggle('active', index === tabIndex);
        });
        document.querySelectorAll('.tab-content').forEach((content, index) => {
            content.classList.toggle('active', index === tabIndex);
        });

        // Load tab data ONLY when needed
        if (tabIndex > 0) {
            this.loadTabData(tabIndex);
        }
    }

    loadTabData(tabIndex) {
        const tabKey = `tab_${tabIndex}`;
        
        // Check cache first - INSTANT if cached
        if (this.cache[tabKey]) {
            this.renderTab(tabIndex, this.cache[tabKey]);
            return;
        }

        // Show loading
        const tabContent = document.querySelector(`#tab${tabIndex}`);
        if (tabContent) {
            tabContent.classList.add('loading');
        }

        // Load data for specific tab
        switch (tabIndex) {
            case 1:
                this.cache[tabKey] = this.cache.mainData?.gsScriptData?.monthlyAnalysis || {};
                this.renderMonthlyAnalysis(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
            case 2:
                this.cache[tabKey] = this.cache.mainData?.gsScriptData?.clientAnalysisTable || {};
                this.renderGSClientAnalysis(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
            case 3:
                this.cache[tabKey] = this.cache.mainData?.gsScriptData?.cityAnalysisTable || {};
                this.renderGSCityAnalysis(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
            case 4:
                this.cache[tabKey] = this.cache.mainData?.gsScriptData?.comprehensiveSummary || {};
                this.renderComprehensiveSummary(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
            case 5:
                this.cache[tabKey] = this.cache.mainData || {};
                this.renderClientAnalysis(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
            case 6:
                this.cache[tabKey] = this.cache.mainData || {};
                this.renderLocationAnalysis(this.cache[tabKey]);
                tabContent?.classList.remove('loading');
                break;
        }
    }
    
    // =================== ENHANCED TAB RENDERING FUNCTIONS ===================
    
    renderMonthlyAnalysis(monthlyData) {
        if (!monthlyData) return;

        const months = Object.keys(monthlyData).sort();
        const monthFilter = document.getElementById('monthFilter');
        
        monthFilter.innerHTML = '<option value="all">All Months</option>' + 
            months.map(m => `<option value="${m}">${m}</option>`).join('');

        let html = '';
        months.forEach(month => {
            const data = monthlyData[month];
            
            html += `
                <div style="margin-bottom: 40px;">
                    <h4 style="background: var(--status-active-bg); color: white; padding: 20px; margin: 0; border-radius: 15px; text-align: center; font-size: 1.2rem; font-weight: 800;">
                        🟢 ACTIVE VEHICLES - ${month.toUpperCase()}
                    </h4>
                    <div style="margin-top: 20px;">
                        ${data.activeVehicles.length === 0 ? 
                            `<p style="font-style: italic; color: var(--text-secondary); text-align: center; padding: 30px; background: var(--bg-card); border-radius: 12px;">No active vehicles found for ${month}</p>` :
                            this.generateActiveTable(data.activeVehicles)
                        }
                    </div>
                    
                    <h4 style="background: var(--status-offline-bg); color: white; padding: 20px; margin: 30px 0 0 0; border-radius: 15px; text-align: center; font-size: 1.2rem; font-weight: 800;">
                        🔴 OFFLINE >24HRS VEHICLES - ${month.toUpperCase()}
                    </h4>
                    <div style="margin-top: 20px;">
                        ${data.offlineVehicles.length === 0 ?
                            `<p style="font-style: italic; color: var(--text-secondary); text-align: center; padding: 30px; background: var(--bg-card); border-radius: 12px;">No offline vehicles found for ${month}</p>` :
                            this.generateOfflineTable(data.offlineVehicles)
                        }
                    </div>
                    
                    <h4 style="background: var(--status-aligned-bg); color: white; padding: 20px; margin: 30px 0 0 0; border-radius: 15px; text-align: center; font-size: 1.2rem; font-weight: 800;">
                        ⚖️ ALIGNMENT TIMELINE - ${month.toUpperCase()}
                    </h4>
                    <div style="margin-top: 20px;">
                        ${data.alignmentVehicles.length === 0 ?
                            `<p style="font-style: italic; color: var(--text-secondary); text-align: center; padding: 30px; background: var(--bg-card); border-radius: 12px;">No alignment changes found for ${month}</p>` :
                            this.generateAlignmentTable(data.alignmentVehicles)
                        }
                    </div>
                </div>
            `;
        });

        document.getElementById('monthlyAnalysisContainer').innerHTML = html;
    }

    generateActiveTable(vehicles) {
        const rows = vehicles.map((vehicle, index) => `
            <tr>
                <td style="text-align: center; color: var(--text-primary); font-weight: 600;">${index + 1}</td>
                <td style="text-align: center; font-weight: 700; color: var(--text-primary);">${vehicle.vehicle}</td>
                <td style="text-align: center;"><span class="status-active">${vehicle.status}</span></td>
            </tr>
        `).join('');
        
        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: var(--bg-card); border-radius: 15px; overflow: hidden; box-shadow: var(--shadow);">
                <thead>
                    <tr style="background: var(--status-active-bg);">
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">S.No</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Vehicle Number</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Status</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    generateOfflineTable(vehicles) {
        const maxDates = Math.max(...vehicles.map(v => v.dates.length));
        
        const headerCols = Array.from({length: maxDates}, (_, i) => 
            `<th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Date ${i + 1}</th>`
        ).join('');
        
        const rows = vehicles.map((vehicle, index) => {
            const dateCols = Array.from({length: maxDates}, (_, i) => {
                const dateValue = vehicle.dates[i] || '';
                return `<td style="padding: 12px; text-align: center; color: var(--text-primary);">${dateValue}</td>`;
            }).join('');
            
            return `
                <tr>
                    <td style="padding: 12px; text-align: center; color: var(--text-primary); font-weight: 600;">${index + 1}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 700; color: var(--text-primary);">${vehicle.vehicle}</td>
                    ${dateCols}
                    <td style="padding: 12px; text-align: center; color: var(--text-primary);">${vehicle.remarks}</td>
                </tr>
            `;
        }).join('');
        
        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: var(--bg-card); border-radius: 15px; overflow: hidden; box-shadow: var(--shadow);">
                <thead>
                    <tr style="background: var(--status-offline-bg);">
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">S.No</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Vehicle Number</th>
                        ${headerCols}
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Remarks</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    generateAlignmentTable(vehicles) {
        const rows = vehicles.map((vehicle, index) => {
            const statusClass = vehicle.latestStatus === 'Alligned' ? 'status-aligned' : 'status-misaligned';
            return `
                <tr>
                    <td style="padding: 12px; text-align: center; color: var(--text-primary); font-weight: 600;">${index + 1}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 700; color: var(--text-primary);">${vehicle.vehicle}</td>
                    <td style="padding: 12px; max-width: 300px; color: var(--text-primary); font-size: 0.9rem;">${vehicle.timeline}</td>
                    <td style="padding: 12px; text-align: center;"><span class="${statusClass}">${vehicle.latestStatus}</span></td>
                    <td style="padding: 12px; text-align: center; color: var(--text-primary);">${vehicle.remarks}</td>
                </tr>
            `;
        }).join('');
        
        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: var(--bg-card); border-radius: 15px; overflow: hidden; box-shadow: var(--shadow);">
                <thead>
                    <tr style="background: var(--status-aligned-bg);">
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">S.No</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Vehicle Number</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Alignment Timeline</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Latest Status</th>
                        <th style="padding: 15px; color: white; text-align: center; font-weight: 800;">Remarks</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    renderGSClientAnalysis(clientData) {
        if (!clientData || !clientData.data) return;

        const html = clientData.data.map(client => {
            const statusClass = client.hasProblems ? 'status-offline' : 'status-active';
            const rowClass = client.hasProblems ? 'style="background: rgba(239, 68, 68, 0.1);"' : '';
            
            return `
                <tr ${rowClass}>
                    <td style="text-align: center; font-weight: 700; color: var(--text-primary);">${client.sno}</td>
                    <td><strong style="color: var(--text-primary); font-size: 1rem;">${client.clientName}</strong></td>
                    <td style="text-align: center; font-weight: 700; color: var(--text-primary);">${client.vehicleCount}</td>
                    <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-primary);">${client.vehicleNumbers}</td>
                    <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-primary);">${client.problemVehicles}</td>
                    <td style="text-align: center;"><span class="${statusClass}">${client.status}</span></td>
                </tr>
            `;
        }).join('');
        
        document.getElementById('gsClientAnalysisBody').innerHTML = html;
        
        const status = document.getElementById('gsClientFilterStatus');
        if (status) {
            status.innerHTML = `<i class="fas fa-building"></i> Client Analysis from ${clientData.displayDate} - ${clientData.data.length} clients found`;
            status.style.background = 'var(--success)';
            status.style.color = 'white';
        }
    }

    renderGSCityAnalysis(cityData) {
        if (!cityData || !cityData.data) return;

        const html = cityData.data.map(city => {
            const statusClass = city.hasProblems ? 'status-offline' : 'status-active';
            const rowClass = city.hasProblems ? 'style="background: rgba(239, 68, 68, 0.1);"' : '';
            
            return `
                <tr ${rowClass}>
                    <td style="text-align: center; font-weight: 700; color: var(--text-primary);">${city.sno}</td>
                    <td><strong style="color: var(--text-primary); font-size: 1rem;">${city.cityName}</strong></td>
                    <td style="text-align: center; font-weight: 700; color: var(--text-primary);">${city.vehicleCount}</td>
                    <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-primary);">${city.vehicleNumbers}</td>
                    <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-primary);">${city.problemVehicles}</td>
                    <td style="text-align: center;"><span class="${statusClass}">${city.status}</span></td>
                </tr>
            `;
        }).join('');
        
        document.getElementById('gsCityAnalysisBody').innerHTML = html;
        
        const status = document.getElementById('gsCityFilterStatus');
        if (status) {
            status.innerHTML = `<i class="fas fa-map-marker-alt"></i> City Analysis from ${cityData.displayDate} - ${cityData.data.length} cities found`;
            status.style.background = 'var(--success)';
            status.style.color = 'white';
        }
    }

    renderComprehensiveSummary(summaryData) {
        if (!summaryData) return;

        const months = Object.keys(summaryData.monthlyCounts).sort();
        
        const monthlyCardsHtml = months.map(month => {
            const counts = summaryData.monthlyCounts[month];
            return `
                <div style="margin-bottom: 25px; padding: 25px; background: var(--bg-glass); border-radius: 18px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                    <h4 style="margin: 0 0 20px 0; color: white; font-size: 1.2rem; text-align: center; background: var(--primary); padding: 15px; border-radius: 12px; font-weight: 800;">${month.toUpperCase()} SUMMARY</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                        <div style="background: var(--status-active-bg); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: var(--shadow);">
                            <div style="font-size: 2rem; font-weight: 900; margin-bottom: 6px;">${counts.active}</div>
                            <div style="font-size: 0.9rem; font-weight: 700;">🟢 Active Vehicles</div>
                        </div>
                        <div style="background: var(--status-offline-bg); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: var(--shadow);">
                            <div style="font-size: 2rem; font-weight: 900; margin-bottom: 6px;">${counts.offline}</div>
                            <div style="font-size: 0.9rem; font-weight: 700;">🔴 Offline Vehicles</div>
                        </div>
                        <div style="background: var(--status-aligned-bg); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: var(--shadow);">
                            <div style="font-size: 2rem; font-weight: 900; margin-bottom: 6px;">${counts.alignment}</div>
                            <div style="font-size: 0.9rem; font-weight: 700;">⚖️ Alignment Issues</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const html = `
            <div style="background: var(--primary); color: white; padding: 30px; border-radius: 18px; text-align: center; margin-bottom: 35px; box-shadow: var(--shadow);">
                <h3 style="margin: 0; font-size: 2rem; font-weight: 900;">📊 COMPREHENSIVE ANALYSIS SUMMARY</h3>
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem; font-weight: 500;">Complete vehicle performance overview</p>
            </div>
            
            <div style="margin-bottom: 35px;">
                <h4 style="color: var(--text-primary); margin-bottom: 25px; text-align: center; font-size: 1.4rem; font-weight: 800;">📅 MONTHLY BREAKDOWN</h4>
                ${monthlyCardsHtml}
            </div>
            
            <div style="background: var(--bg-glass); padding: 35px; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                <h3 style="color: white; margin-bottom: 30px; text-align: center; font-size: 1.6rem; background: var(--primary); padding: 15px; border-radius: 12px; font-weight: 900;">📈 OVERALL TOTALS</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px;">
                    <div style="text-align: center; padding: 30px; background: var(--primary); color: white; border-radius: 15px; box-shadow: var(--shadow);">
                        <div style="font-size: 3rem; font-weight: 900; margin-bottom: 10px;">${summaryData.totalVehicles}</div>
                        <div style="font-size: 1.1rem; font-weight: 700;">🚗 Total Vehicles</div>
                    </div>
                    <div style="text-align: center; padding: 30px; background: var(--secondary); color: white; border-radius: 15px; box-shadow: var(--shadow);">
                        <div style="font-size: 3rem; font-weight: 900; margin-bottom: 10px;">${summaryData.totalClients}</div>
                        <div style="font-size: 1.1rem; font-weight: 700;">👥 Total Clients</div>
                    </div>
                    <div style="text-align: center; padding: 30px; background: var(--success); color: white; border-radius: 15px; box-shadow: var(--shadow);">
                        <div style="font-size: 3rem; font-weight: 900; margin-bottom: 10px;">${summaryData.totalCities}</div>
                        <div style="font-size: 1.1rem; font-weight: 700;">🏙️ Total Cities</div>
                    </div>
                    <div style="text-align: center; padding: 30px; background: var(--warning); color: white; border-radius: 15px; box-shadow: var(--shadow);">
                        <div style="font-size: 1.4rem; font-weight: 900; margin-bottom: 10px;">${summaryData.dataSourceDate}</div>
                        <div style="font-size: 1.1rem; font-weight: 700;">📅 Data Source Date</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('comprehensiveSummaryContainer').innerHTML = html;
    }

    renderClientAnalysis(data) {
        if (!data || !data.clientAnalysis) return;

        // Convert clientAnalysis to array format
        const clientsArray = Object.keys(data.clientAnalysis).map(clientName => {
            const vehicles = data.clientAnalysis[clientName];
            return {
                name: clientName,
                totalVehicles: vehicles.length,
                activeVehicles: vehicles.filter(v => v.workingStatus === 'Active').length,
                offlineVehicles: vehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline')).length,
                alignedVehicles: vehicles.filter(v => v.alignmentStatus === 'Alligned').length,
                misalignedVehicles: vehicles.filter(v => v.alignmentStatus === 'Misalligned').length,
                vehicles: vehicles
            };
        }).sort((a, b) => b.totalVehicles - a.totalVehicles);

        // Render table
        const html = clientsArray.map(client => `
            <tr onclick="dashboard.showClientDetails('${client.name}')" style="cursor: pointer;" onmouseover="this.style.background='var(--bg-glass)'" onmouseout="this.style.background=''">
                <td><strong style="color: var(--text-primary); font-size: 1rem;">${client.name}</strong></td>
                <td style="color: var(--text-primary); font-weight: 600;">${client.totalVehicles}</td>
                <td><span class="status-active">${client.activeVehicles}</span></td>
                <td><span class="status-offline">${client.offlineVehicles}</span></td>
                <td><span class="status-aligned">${client.alignedVehicles}</span></td>
                <td><span class="status-misaligned">${client.misalignedVehicles}</span></td>
                <td style="color: var(--text-primary);">Multiple</td>
            </tr>
        `).join('');

        document.getElementById('clientAnalysisBody').innerHTML = html;

        // Render chart
        const ctx = document.getElementById('clientChart');
        if (ctx) {
            if (this.charts.client) this.charts.client.destroy();

            const labels = clientsArray.slice(0, 12).map(c => c.name);
            const chartData = clientsArray.slice(0, 12).map(c => c.totalVehicles);
            const colors = [
                '#667eea', '#f093fb', '#4facfe', '#fa709a', '#ff6b6b',
                '#764ba2', '#fee140', '#00f2fe', '#f5576c', '#ee5a52',
                '#a8edea', '#fed6e3'
            ];

            this.charts.client = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: chartData,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { 
                                font: { size: 11, weight: 'bold' },
                                color: '#e2e8f0',
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#667eea',
                            borderWidth: 1
                        }
                    },
                    animation: { duration: 1200, easing: 'easeOutQuart' }
                }
            });
        }
    }

    renderLocationAnalysis(data) {
        if (!data || !data.cityAnalysis) return;

        // Convert cityAnalysis to array format
        const locationsArray = Object.keys(data.cityAnalysis).map(locationName => {
            const vehicles = data.cityAnalysis[locationName];
            return {
                name: locationName,
                totalVehicles: vehicles.length,
                activeVehicles: vehicles.filter(v => v.workingStatus === 'Active').length,
                offlineVehicles: vehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline')).length,
                alignedVehicles: vehicles.filter(v => v.alignmentStatus === 'Alligned').length,
                misalignedVehicles: vehicles.filter(v => v.alignmentStatus === 'Misalligned').length,
                vehicles: vehicles
            };
        }).sort((a, b) => b.totalVehicles - a.totalVehicles);

        // Render table
        const html = locationsArray.map(location => `
            <tr onclick="dashboard.showLocationDetails('${location.name}')" style="cursor: pointer;" onmouseover="this.style.background='var(--bg-glass)'" onmouseout="this.style.background=''">
                <td><strong style="color: var(--text-primary); font-size: 1rem;">${location.name}</strong></td>
                <td style="color: var(--text-primary); font-weight: 600;">${location.totalVehicles}</td>
                <td><span class="status-active">${location.activeVehicles}</span></td>
                <td><span class="status-offline">${location.offlineVehicles}</span></td>
                <td><span class="status-aligned">${location.alignedVehicles}</span></td>
                <td><span class="status-misaligned">${location.misalignedVehicles}</span></td>
                <td style="color: var(--text-primary);">Multiple</td>
            </tr>
        `).join('');

        document.getElementById('locationAnalysisBody').innerHTML = html;

        // Render chart
        const ctx = document.getElementById('locationChart');
        if (ctx) {
            if (this.charts.location) this.charts.location.destroy();

            const labels = locationsArray.slice(0, 12).map(l => l.name);
            const chartData = locationsArray.slice(0, 12).map(l => l.totalVehicles);

            this.charts.location = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Vehicles',
                        data: chartData,
                        backgroundColor: '#4facfe',
                        borderWidth: 0,
                        borderRadius: 8,
                        hoverBackgroundColor: '#00f2fe'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#667eea',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#94a3b8' }
                        },
                        x: { 
                            ticks: { 
                                maxRotation: 45, 
                                font: { size: 10 },
                                color: '#94a3b8'
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    animation: { duration: 1000, easing: 'easeOutQuart' }
                }
            });
        }
    }
    
    // =================== SEARCH & FILTER FUNCTIONS ===================
    
    performDashboardSearch() {
        const searchTerm = document.getElementById('dashboardSearchInput').value.toLowerCase();
        const searchSection = document.getElementById('searchResultsSection');
        const searchStatus = document.getElementById('dashboardSearchStatus');
        const tbody = document.getElementById('dashboardSearchBody');

        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        if (!searchTerm.trim()) {
            searchSection.style.display = 'none';
            searchStatus.style.display = 'none';
            return;
        }

        // Debounce for better performance
        this.debounceTimer = setTimeout(() => {
            const allVehicles = this.cache.mainData?.allVehicles || [];
            const results = allVehicles.filter(vehicle => 
                vehicle.vehicle.toLowerCase().includes(searchTerm) ||
                vehicle.client.toLowerCase().includes(searchTerm) ||
                vehicle.location.toLowerCase().includes(searchTerm) ||
                vehicle.workingStatus.toLowerCase().includes(searchTerm) ||
                vehicle.alignmentStatus.toLowerCase().includes(searchTerm) ||
                vehicle.vehicleType.toLowerCase().includes(searchTerm) ||
                vehicle.remarks.toLowerCase().includes(searchTerm)
            );

            if (results && results.length > 0) {
                const html = results.slice(0, 50).map(vehicle => {
                    const workingStatusClass = vehicle.workingStatus.toLowerCase().includes('active') ? 'status-active' : 'status-offline';
                    const alignmentStatusClass = vehicle.alignmentStatus.toLowerCase().includes('alligned') && !vehicle.alignmentStatus.toLowerCase().includes('misalligned') ? 'status-aligned' : 'status-misaligned';
                    
                    return `
                        <tr>
                            <td style="color: var(--text-primary); font-weight: 600;">${vehicle.vehicle}</td>
                            <td style="color: var(--text-primary);">${vehicle.client}</td>
                            <td style="color: var(--text-primary);">${vehicle.location}</td>
                            <td><span class="${workingStatusClass}">${vehicle.workingStatus}</span></td>
                            <td><span class="${alignmentStatusClass}">${vehicle.alignmentStatus}</span></td>
                            <td style="color: var(--text-primary);">${vehicle.date}</td>
                        </tr>
                    `;
                }).join('');

                tbody.innerHTML = html;
                searchStatus.innerHTML = `<i class="fas fa-search"></i> Found ${results.length} results for "${searchTerm}"`;
                searchStatus.style.background = 'var(--success)';
            } else {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">No results found for "${searchTerm}"</td></tr>`;
                searchStatus.innerHTML = `<i class="fas fa-search"></i> No results found for "${searchTerm}"`;
                searchStatus.style.background = 'var(--danger)';
            }
            
            searchStatus.style.color = 'white';
            searchStatus.style.display = 'flex';
            searchSection.style.display = 'block';
        }, 300); // 300ms debounce
    }
    
    toggleClientList(filter) {
        document.querySelectorAll('#tab0 .section-card:first-child .list-toggle-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        if (this.cache.mainData) {
            this.renderClientList(this.cache.mainData, filter === 'issues');
        }
    }

    toggleLocationList(filter) {
        document.querySelectorAll('#tab0 .section-card:last-child .list-toggle-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        if (this.cache.mainData) {
            this.renderLocationList(this.cache.mainData, filter === 'issues');
        }
    }

    updateMonthlyAnalysisByMonth() {
        const selectedMonth = document.getElementById('monthFilter').value;
        const monthlyData = this.cache.mainData?.gsScriptData?.monthlyAnalysis || {};
        
        if (selectedMonth === 'all') {
            this.renderMonthlyAnalysis(monthlyData);
        } else {
            const filtered = {};
            if (monthlyData[selectedMonth]) {
                filtered[selectedMonth] = monthlyData[selectedMonth];
            }
            this.renderMonthlyAnalysis(filtered);
        }
    }
    
    // =================== MODAL FUNCTIONS ===================
    
    showVehicleDetails(category) {
        if (!this.cache.mainData) return;
        
        const data = this.cache.mainData;
        let vehicles = [];
        let title = '';
        
        switch (category) {
            case 'total':
                vehicles = data.allVehicles;
                title = `All Vehicles (${vehicles.length})`;
                break;
            case 'active':
                vehicles = data.allVehicles.filter(v => v.workingStatus === 'Active');
                title = `Active Vehicles (${vehicles.length})`;
                break;
            case 'offline':
                vehicles = data.allVehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline'));
                title = `Offline Vehicles (${vehicles.length})`;
                break;
            case 'aligned':
                vehicles = data.allVehicles.filter(v => v.alignmentStatus === 'Alligned');
                title = `Aligned Vehicles (${vehicles.length})`;
                break;
            case 'misaligned':
                vehicles = data.allVehicles.filter(v => v.alignmentStatus === 'Misalligned');
                title = `Misaligned Vehicles (${vehicles.length})`;
                break;
        }
        
        this.showVehicleModal(title, vehicles);
    }
    
    showClientDetails(clientName) {
        if (!this.cache.mainData || !this.cache.mainData.clientAnalysis[clientName]) return;
        
        const vehicles = this.cache.mainData.clientAnalysis[clientName];
        const title = `Client: ${clientName} (${vehicles.length} vehicles)`;
        
        this.showVehicleModal(title, vehicles);
    }
    
    showLocationDetails(locationName) {
        if (!this.cache.mainData || !this.cache.mainData.cityAnalysis[locationName]) return;
        
        const vehicles = this.cache.mainData.cityAnalysis[locationName];
        const title = `Location: ${locationName} (${vehicles.length} vehicles)`;
        
        this.showVehicleModal(title, vehicles);
    }
    
    showVehicleModal(title, vehicles) {
        if (!vehicles.length) {
            this.showModal(title, '<p style="color: var(--text-primary);">No vehicles found.</p>');
            return;
        }
        
        const html = `
            <div style="margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0;">
                    <div style="background: var(--status-active-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.workingStatus === 'Active').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Active</div>
                    </div>
                    <div style="background: var(--status-offline-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.workingStatus.includes('Offlline')).length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Offline</div>
                    </div>
                    <div style="background: var(--status-aligned-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.alignmentStatus === 'Alligned').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Aligned</div>
                    </div>
                    <div style="background: var(--status-misaligned-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.alignmentStatus === 'Misalligned').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Misaligned</div>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Vehicle</th><th>Client</th><th>Location</th>
                        <th>Status</th><th>Alignment</th><th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map(vehicle => {
                        const workingStatusClass = vehicle.workingStatus === 'Active' ? 'status-active' : 'status-offline';
                        const alignmentStatusClass = vehicle.alignmentStatus === 'Alligned' ? 'status-aligned' : 'status-misaligned';
                        
                        return `
                            <tr>
                                <td style="color: var(--text-primary); font-weight: 600;">${vehicle.vehicle}</td>
                                <td style="color: var(--text-primary);">${vehicle.client}</td>
                                <td style="color: var(--text-primary);">${vehicle.location}</td>
                                <td><span class="${workingStatusClass}">${vehicle.workingStatus}</span></td>
                                <td><span class="${alignmentStatusClass}">${vehicle.alignmentStatus}</span></td>
                                <td style="color: var(--text-primary);">${vehicle.date}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        this.showModal(title, html);
    }
    
    showModal(title, content) {
        document.getElementById('modalTitle').innerHTML = title;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('detailModal').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('detailModal').style.display = 'none';
    }
    
    // =================== EXPORT FUNCTIONS ===================
    
    exportGSClientData(format) {
        const clientData = this.cache.mainData?.gsScriptData?.clientAnalysisTable;
        if (!clientData || !clientData.data) return;
        
        const exportData = clientData.data.map(client => ({
            'S.No': client.sno,
            'Client Name': client.clientName,
            'Vehicle Count': client.vehicleCount,
            'Vehicle Numbers': client.vehicleNumbers,
            'Problem Vehicles': client.problemVehicles,
            'Status': client.status
        }));

        if (format === 'csv') {
            this.exportToCSV(exportData, 'client_analysis.csv');
        } else if (format === 'pdf') {
            this.exportToPDF(exportData, 'client_analysis.pdf');
        }
    }

    exportGSCityData(format) {
        const cityData = this.cache.mainData?.gsScriptData?.cityAnalysisTable;
        if (!cityData || !cityData.data) return;
        
        const exportData = cityData.data.map(city => ({
            'S.No': city.sno,
            'City / Location': city.cityName,
            'Vehicle Count': city.vehicleCount,
            'Vehicle Numbers': city.vehicleNumbers,
            'Problem Vehicles': city.problemVehicles,
            'Status': city.status
        }));

        if (format === 'csv') {
            this.exportToCSV(exportData, 'city_analysis.csv');
        } else if (format === 'pdf') {
            this.exportToPDF(exportData, 'city_analysis.pdf');
        }
    }

    exportToCSV(data, filename) {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv');
    }

    exportToPDF(data, filename) {
        if (!data.length) return;
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Vehicle Data Export', 10, 20);
        
        let y = 40;
        const headers = Object.keys(data[0]);
        
        doc.setFontSize(10);
        headers.forEach((header, index) => {
            doc.text(header, 10 + (index * 25), y);
        });
        
        y += 10;
        
        data.forEach(row => {
            headers.forEach((header, index) => {
                doc.text(String(row[header]).substring(0, 12), 10 + (index * 25), y);
            });
            y += 8;
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });
        
        doc.save(filename);
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // =================== UTILITY FUNCTIONS ===================
    
    setupEventListeners() {
        // Close modal on outside click
        window.onclick = (event) => {
            const modal = document.getElementById('detailModal');
            if (event.target === modal) {
                this.closeModal();
            }
        };
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
        });
    }
    
    refreshData() {
        console.log('🔄 Refreshing data...');
        this.cache = {};
        this.startLoading();
    }
    
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        
        const button = document.querySelector('.theme-toggle');
        button.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Light Mode' : 
            '<i class="fas fa-moon"></i> Dark Mode';
        
        // Update charts for new theme
        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.update) chart.update();
            });
        }, 100);
    }
}

// =================== GLOBAL FUNCTIONS ===================

// Initialize dashboard when page loads
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new VehicleDashboard();
});

// Global functions for HTML onclick handlers
function saveAPIConfig() {
    dashboard.saveConfig();
}

function showConfig() {
    dashboard.showConfigModal();
}

function refreshData() {
    dashboard.refreshData();
}

function toggleTheme() {
    dashboard.toggleTheme();
}

function switchTab(tabIndex) {
    dashboard.switchTab(tabIndex);
}

function closeModal() {
    dashboard.closeModal();
}

function toggleClientList(filter) {
    dashboard.toggleClientList(filter);
}

function toggleLocationList(filter) {
    dashboard.toggleLocationList(filter);
}

function performDashboardSearch() {
    dashboard.performDashboardSearch();
}

function updateMonthlyAnalysisByMonth() {
    dashboard.updateMonthlyAnalysisByMonth();
}

function exportGSClientData(format) {
    dashboard.exportGSClientData(format);
}

function exportGSCityData(format) {
    dashboard.exportGSCityData(format);
}

console.log('🚀 Complete Vehicle Dashboard JavaScript Loaded - All Original Features Restored!');

