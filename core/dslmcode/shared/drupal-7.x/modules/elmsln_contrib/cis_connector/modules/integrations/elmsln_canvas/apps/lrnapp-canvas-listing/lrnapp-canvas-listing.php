<?php

/**
 * Callback for apps/open-studio/data.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _elmsln_canvas_course_list($machine_name, $app_route, $params, $args) {
  $canvas = canvas_api('courses');
  $courses = $canvas->getCourse(NULL);
  dpm($courses);
  $rosters = array();
  foreach ($courses as $course) {
    $canvas = canvas_api('sections');
    $sections = $canvas->sectionsByCourseID('sis_course_id:' . $course['sis_course_id']);
    dpm($sections);
    $canvas = canvas_api('enrollment');
    foreach ($sections as $section) {
      $rosters[$course['sis_course_id']][] = $canvas->getEnrollment('sis_section_id:' . $section['sis_section_id']);
    }
    foreach ($rosters[$course['sis_course_id']] as $key1 => $enrollments) {
      // drop things that don't have enrollments
      if (empty($enrollments)) {
        unset($rosters[$course['sis_course_id']][$key1]);
      }
      else {
        // look through enrollments for people that are active
        foreach ($enrollments as $key2 => $enrollment) {
          // only keep people who are active
          if ($enrollment['enrollment_state'] != 'active') {
            unset($rosters[$course['sis_course_id']][$key1][$key2]);
          }
        }
      }
    }
  }
  dpm($rosters);
  return array(
    'status' => 200,
    'data' => $return
  );
}