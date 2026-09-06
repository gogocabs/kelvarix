-- 002: phone number (no OTP flow; validated in worker, not DB).
ALTER TABLE leads ADD COLUMN phone TEXT NOT NULL DEFAULT '';
