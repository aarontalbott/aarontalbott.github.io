/*
Simple-Span Beam Calculator

Computes shear force, bending moment, and deflection diagrams for simply supported beams
Up to 10 concentrated loads located at any point on the span.
Up to 10 linearly varying distributed loads located on any area of the span.

Aaron Talbott
12/18/2018

*/

google.charts.load('current', {'packages':['corechart']});

var L = 0; // beam span in feet
var E = 0; // elastic modulus in ksi
var I = 0; // moment of inertia in in^4
var S = 0; // sectopm modulus in in^3

var num_conc_loads = 10; // max number of concentrated load cases
var num_dist_loads = 10; // max number of distributed load cases

var conc_loads = []; // array storing the concentrated load information
var dist_loads = []; // array storing the distributed load information

var results = []; // array storing the calculation results

var num_beam_subdivions = 100; // number of subdivisions for calculating beam results


function drawChart() {
  var resultsWithHeaders = results;
  var headers = ["x", "V", "M", "d"];
  resultsWithHeaders.unshift(headers);
  var data = new google.visualization.arrayToDataTable(resultsWithHeaders);
  var view_shear = new google.visualization.DataView(data);
  var view_moment = new google.visualization.DataView(data);
  var view_displacement = new google.visualization.DataView(data);
  view_shear.setColumns([0,1]);
  view_moment.setColumns([0,2]);
  view_displacement.setColumns([0,3]);
  var options = {'title':'How Much Pizza I Ate Last Night'};
  var chart1 = new google.visualization.LineChart(document.getElementById('shear_diagram'));
  var chart2 = new google.visualization.LineChart(document.getElementById('moment_diagram'));
  var chart3 = new google.visualization.LineChart(document.getElementById('displacement_diagram'));
  chart1.draw(view_shear, options);
  chart2.draw(view_moment, options);
  chart3.draw(view_displacement, options);
}


function calculate() {
    read_form(); // Read data from form
    initialize_results(); // Prepare results array
    calc_point_loads(); // Loop through point loads and add results
    output_text(); // Output to Text Area
    drawChart();
}



function read_form() {
    L = document.getElementById("L").value;
    E = document.getElementById("E").value;
    I = document.getElementById("I").value;
    S = document.getElementById("S").value;

    for (i = 0; i < num_conc_loads; i++ ) {
        p_loc_i = document.getElementById("p-loc-" + String(i + 1)).value;
        p_mag_i = document.getElementById("p-mag-" + String(i + 1)).value;
        conc_loads[i] = [i + 1, p_loc_i, p_mag_i];
    }

    for (i = 0; i < num_dist_loads; i++ ) {
        w_start_loc_i = document.getElementById("w-start-loc-" + String(i + 1)).value;
        w_end_loc_i = document.getElementById("w-end-loc-" + String(i + 1)).value;
        w_start_mag_i = document.getElementById("w-start-mag-" + String(i + 1)).value;
        w_end_mag_i = document.getElementById("w-end-mag-" + String(i + 1)).value;
        dist_loads[i] = [i + 1, w_start_loc_i, w_end_loc_i, w_start_mag_i, w_end_mag_i];
    }
}

function initialize_results() {
    results = [];
    for(i = 0; i < num_beam_subdivions; i++) {
        x = L * i / (num_beam_subdivions - 1); // x coordinate
        results[i] = [x, 0, 0, 0]
        console.log(results[i])
    }
}

function output_text() {
    var report = "";
    report += "**** INPUT ECHO ****\n";
    report += "Beam Properties\n";
    report += "L = " + String(L) + " ft\n";
    report += "E = " + String(E) + " ksi\n";
    report += "I = " + String(I) + " in^4\n";

    report += "\nConcentrated Loads\n";
    for (i = 0; i < num_conc_loads; i++) {
        report += String(conc_loads[i]) + "\n";
    }

    report += "\nDistributed Loads\n";
    for (i = 0; i < num_dist_loads; i++) {
        report += String(dist_loads[i]) + "\n";
    }

    report += "\n**** RESULTS ****\n";
    for (i = 0; i < num_beam_subdivions; i++) {
        report += String(results[i]) + "\n";
    }
    document.getElementById("output").value = report;
}



function calc_point_loads() {

/*
i = beam subdivision counter
j = load counter
*/
    for (i = 0; i < num_beam_subdivions; i++) {
       var x = results[i][0];

       for(j = 0; j < num_conc_loads; j++) {

          var a = conc_loads[j][1];
          var b = L - a;
          var P = conc_loads[j][2];

          if (x <= a) {
              V = P * b / L;
              M = P * b / L * x;
          } else {
              V = -1 * P * a / L;
              M = P * a * (1 - x / L);
          }

          results[i][1] += V;
          results[i][2] += M;
      }

    }

    // for(j = 0; j < num_conc_loads; j++) {
    //     var a = conc_loads[j][1];
    //     var b = L - a;
    //     var P = conc_loads[j][2];
    //
    //     for (i = 0; i < num_beam_subdivions; i++) {
    //         var x = results[0][i];
    //         if (x <= a) {
    //             V = P * b / L;
    //             M = P * b / L * x;
    //         } else {
    //             V = -1 * P * a / L;
    //             M = P * a * (1 - x / L);
    //         }
    //         results[1][i] += V;
    //         results[2][i] += M;
    //     }
    //
    // }


    return results;
}
