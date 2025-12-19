CREATE TRIGGER trg_update_x_on_folder_master
AFTER INSERT OR DELETE ON favorite_video_folder_transaction
FOR EACH ROW
EXECUTE FUNCTION update_folder_master_update_date();
