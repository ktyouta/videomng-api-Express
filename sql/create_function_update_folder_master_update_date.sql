CREATE OR REPLACE FUNCTION update_folder_master_update_date()
RETURNS TRIGGER AS '
BEGIN
  UPDATE 
    folder_master
  SET 
    update_date = NOW() 
  WHERE 
    id = COALESCE(NEW.folder_master_id, OLD.folder_master_id);
  RETURN COALESCE(NEW, OLD);
END;
' LANGUAGE plpgsql;
