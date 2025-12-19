CREATE OR REPLACE FUNCTION update_folder_master_update_date()
RETURNS TRIGGER AS '
BEGIN
  UPDATE 
    folder_master
  SET 
    update_date = NOW() 
  WHERE 
    user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND folder_id = COALESCE(NEW.folder_id, OLD.folder_id);
  RETURN COALESCE(NEW, OLD);
END;
' LANGUAGE plpgsql;
