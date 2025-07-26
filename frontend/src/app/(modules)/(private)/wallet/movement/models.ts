export class Transaction {
  tcs_pk_id:string;
  tcs_st_type: string;
  tcs_db_value: number;
  tcs_dt_date: Date;
  tcs_st_name: string;
  tcs_st_description: string;

  
    constructor(tcs_pk_id:string, tcs_db_value: number, tcs_st_type: string, tcs_st_name = "", tcs_dt_date: Date, tcs_st_description: string) {
      this.tcs_pk_id=tcs_pk_id;
      this.tcs_db_value = tcs_db_value;
      this.tcs_st_type = tcs_st_type;
      this.tcs_st_name = tcs_st_name;
      this.tcs_dt_date = tcs_dt_date;
      this.tcs_st_description=tcs_st_description;
    }
  }
  