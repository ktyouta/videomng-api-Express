CREATE OR REPLACE FUNCTION update_favorite_video_transaction_update_date()
RETURNS TRIGGER AS '
BEGIN
  UPDATE favorite_video_transaction 
  SET update_date = NOW() 
  WHERE user_id = NEW.user_id 
    AND video_id = NEW.video_id;
  RETURN NEW;
END;
' LANGUAGE plpgsql;
