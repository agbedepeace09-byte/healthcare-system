const prisma = require('./prismaClient');

(async () => {
  try {
    const wards = await prisma.ward.findMany({
      include: {
        _count: { select: { beds: true, dripStands: true } },
        beds: { include: { patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } } } },
        dripStands: { include: { patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } } } },
      },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });
    console.log('Wards:', wards.length);
  } catch (err) {
    console.error('Wards query error:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
