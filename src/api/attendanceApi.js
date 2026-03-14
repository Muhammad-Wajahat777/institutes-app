import supabase from './supabaseClient';

const toValidStudentId = (studentId) => {
  if (studentId === null || studentId === undefined) return null;
  const trimmed = String(studentId).trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return null;

  // Support both bigint-like IDs and UUID/string IDs.
  return trimmed;
};

const attendanceApi = {
  // Get attendance map for one date: { [studentId]: boolean }
  getByDate: async (date) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('attendance_date', date);

    if (error) throw error;

    const map = {};
    (data || []).forEach((row) => {
      map[row.student_id] = row.status === 'Present';
    });

    return map;
  },

  // Upsert attendance rows for one date
  saveByDate: async (date, attendanceMap) => {
    const now = new Date().toISOString();
    const rows = Object.entries(attendanceMap)
      .map(([studentId, isPresent]) => {
        const validStudentId = toValidStudentId(studentId);
        if (!validStudentId) return null;

        return {
          student_id: validStudentId,
          attendance_date: date,
          status: isPresent ? 'Present' : 'Absent',
          marked_at: now,
          updated_at: now,
        };
      })
      .filter(Boolean);

    if (rows.length === 0) {
      throw new Error('No valid student IDs found while saving attendance.');
    }

    const { data, error } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,attendance_date' })
      .select();

    if (error) throw error;
    return data || [];
  },
};

export default attendanceApi;