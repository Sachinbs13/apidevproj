export async function getLanguages(req, res, next) {
  try {
    res.json({
      success: true,
      data: ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam']
    });
  } catch (error) {
    next(error);
  }
}

export default { getLanguages };
