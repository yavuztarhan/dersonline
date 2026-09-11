import { AcademicWeek, getCurrentOrNextAcademicWeek } from './academic-calendar';
import { getAnnualPlanByWeek } from './annual-plan-data';
import { getOutcomeById, getBreadcrumbPath, CURRICULUM_DATA } from './curriculum-data';

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
    // 1. İlgili haftanın yıllık plan maddesini al
    const planItem = getAnnualPlanByWeek(week.weekNo, gradeLevel);
    
    // Yıllık plan maddesi varsa kazanımı doğrudan koddan ara
    let outcome = planItem ? getOutcomeById(planItem.outcomeCode) : undefined;

    // Yıllık plan maddesi henüz yoksa veya kazanım bulunamadıysa (örneğin 7. veya 8. sınıf için),
    // CURRICULUM_DATA içindeki kayıtlı ilk kazanımı yedek olarak kontrol et
    if (!outcome) {
      const gradeDef = CURRICULUM_DATA.find((g) => g.level === gradeLevel);
      if (gradeDef) {
        for (const subj of gradeDef.subjects) {
          for (const unit of subj.units) {
            for (const topic of unit.topics) {
              if (topic.outcomes.length > 0) {
                outcome = topic.outcomes[0];
                break;
              }
            }
            if (outcome) break;
          }
          if (outcome) break;
        }
      }
    }

    // Eğer sistemimizde bu sınıf seviyesi için kayıtlı aktif bir kazanım varsa kartını oluştur
    if (outcome) {
      const breadcrumb = getBreadcrumbPath(outcome.id);

      items.push({
        gradeLevel,
        gradeTitle: breadcrumb?.grade.title || `${gradeLevel}. Sınıf`,
        gradeColor: breadcrumb?.grade.color || 'from-teal-500 to-emerald-700',
        subjectTitle: breadcrumb?.subject.title || 'Matematik',
        unitTitle: breadcrumb?.unit.title || planItem?.unite || '1. Ünite',
        topicTitle: breadcrumb?.topic.title || planItem?.konu || outcome.shortTitle || outcome.title,
        outcomeCode: outcome.code,
        outcomeTitle: outcome.shortTitle || outcome.title,
        outcomeId: outcome.id,
        weekNo: week.weekNo,
        weekLabel: week.label,
        weekDateRange: week.formattedDateRange,
        isUpcoming,
      });
    }
  }

  return {
    week,
    isUpcoming,
    matchedExact,
    items,
  };
}
