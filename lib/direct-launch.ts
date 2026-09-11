import { AcademicWeek, getCurrentOrNextAcademicWeek } from './academic-calendar';
import { getAnnualPlanByWeek } from './annual-plan-data';
import { getOutcomeById, getBreadcrumbPath } from './curriculum-data';

export interface DirectLaunchCardItem {
  gradeLevel: number;
  gradeTitle: string;
  gradeColor: string;
  subjectTitle: string;
  unitTitle: string;
  topicTitle: string;
  outcomeCode: string;
  outcomeTitle: string;
  outcomeId: string;
  weekNo: number;
  weekLabel: string;
  weekDateRange: string;
  isUpcoming: boolean;
}

export interface DirectLaunchData {
  week: AcademicWeek;
  isUpcoming: boolean;
  matchedExact: boolean;
  items: DirectLaunchCardItem[];
}

/**
 * Sunucu/kullanıcı tarihine göre eşleşen veya bir sonraki haftanın
 * 5, 6, 7 ve 8. sınıf seviyelerindeki kayıtlı kazanımlarını getirir.
 */
export function getDirectLaunchData(currentDate: Date = new Date()): DirectLaunchData {
  const { week, isUpcoming, matchedExact } = getCurrentOrNextAcademicWeek(currentDate);
  const gradeLevels = [5, 6, 7, 8];
  const items: DirectLaunchCardItem[] = [];

  for (const gradeLevel of gradeLevels) {
    // İlgili haftanın sınıf seviyesine özel yıllık plan maddesini al
    const planItem = getAnnualPlanByWeek(week.weekNo, gradeLevel);
    if (!planItem) continue;

    // Yıllık plan maddesi varsa kazanımı koddan ara
    const outcome = getOutcomeById(planItem.outcomeCode);
    if (!outcome) continue;

    const breadcrumb = getBreadcrumbPath(outcome.id);
    // Güvenlik kontrolü: Kazanımın ait olduğu sınıf seviyesi eşleşmeli
    if (breadcrumb && breadcrumb.grade.level !== gradeLevel) continue;

    items.push({
      gradeLevel,
      gradeTitle: breadcrumb?.grade.title || `${gradeLevel}. Sınıf`,
      gradeColor: breadcrumb?.grade.color || 'from-teal-500 to-emerald-700',
      subjectTitle: breadcrumb?.subject.title || 'Matematik',
      unitTitle: breadcrumb?.unit.title || planItem.unite || '1. Ünite',
      topicTitle: breadcrumb?.topic.title || planItem.konu || outcome.shortTitle || outcome.title,
      outcomeCode: outcome.code,
      outcomeTitle: outcome.shortTitle || outcome.title,
      outcomeId: outcome.id,
      weekNo: week.weekNo,
      weekLabel: week.label,
      weekDateRange: week.formattedDateRange,
      isUpcoming,
    });
  }

  return {
    week,
    isUpcoming,
    matchedExact,
    items,
  };
}
