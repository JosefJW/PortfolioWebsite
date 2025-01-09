const code_container = document.getElementById("code-container");
code_container.innerHTML = "|";

function type_text(text, wait) {
    let text_chars = 0;
    console.log(wait);
    setTimeout(function() {
        code_container.innerHTML = "|";
    }, text_chars*30+wait);
    for (let word of text.split(" ")) {
        for (let i = 0; i < word.length; i++) {
            setTimeout(function() {
                code_container.innerHTML = code_container.innerHTML.slice(0, -1);
                code_container.innerHTML += word.charAt(i);
                color_text();
                code_container.innerHTML += "|";
            }, text_chars*30+wait);
            text_chars++;
        }
        setTimeout(function() {
            code_container.innerHTML = code_container.innerHTML.slice(0, -1);
            code_container.innerHTML += " ";
            color_text();
            code_container.innerHTML += "|";
        }, text_chars*30+wait);
        text_chars++;
    }
    color_text();
}

function color_text() {
    changes = code_container.innerHTML

    var re = /[^>](def|class)/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: skyblue">${captureGroup1}</span>`;
    });

    re = /[^>]\b(Me|time)\b/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: rgb(248, 197, 209)">${captureGroup1}</span>`;
    })

    re = /[^>](__init__|analyze_data|code_feature|debug_code)/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return ` <span style="color: #FFEE8C">${captureGroup1}</span>`;
    })

    re = /[^>]("Josef Wolf"|"2nd Year Undergrad"|"Python"|"Java"|"R"|"C"|"Web Design"|"Flask"|"Machine Learning"|"Data Analysis and Presentation"|"JavaScript"|"HTML"|"CSS"|"On it!"|"Right away!"|"Do I have to\?")/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return ` <span style="color: #CCE2CB">${captureGroup1}</span>`;
    })

    re = /[\s|^>]"(josefwolf591@gmail\.com)"[^<]/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return ` "<span style="color: #55CBCD"><a href="mailto:josefwolf591@gmail.com" style="color: #ABDEE6" target="_blank">${captureGroup1}</a></span>",`;
    })

    re = /[\s|^>]"(https:\/\/www\.linkedin\.com\/in\/josef-j-wolf\/)"[^<]/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return ` "<a href="https://www.linkedin.com/in/josef-j-wolf" style="color: #ABDEE6" target="_blank">${captureGroup1}</a>",`;
    })

    re = /[\s|^>]"(https:\/\/github\.com\/JosefJW)"[^<]/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return ` "<a href="https://github.com/JosefJW" style="color: #ABDEE6" target="_blank">${captureGroup1}</a>"`;
    })

    re = /[^>](self)/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return `\t<span style="color:rgb(248, 197, 209)">${captureGroup1}</span>`;
    })

    re = /[^>](import)/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return `\t<span style="color:rgb(179, 78, 140)">${captureGroup1}</span>`;
    })

    re = /[^>](return)/g
    changes = changes.replaceAll(re, (match, captureGroup1) => {
        return `\t<span style="color:rgb(255, 106, 106)">${captureGroup1}</span>`;
    })


    if (changes !== code_container.innerHTML) {
        code_container.innerHTML = changes;
    }
}

function color_text2() {
    // Keywords - skyblue
    var re = /(\bdef\b|\bif\b|\belif\b|\belse\b|\breturn\b|\bwhile\b|\bwith\b|\bas\b|\bfor\b|\bin\s)/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: skyblue">${captureGroup1}</span>`;
    })

    // Comments - lightgreen
    re = /(#.*)/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: lightgreen">${captureGroup1}</span>`;
    });
    re = /[^<>]"{3}([\s\S^(""")]*)?("{3})\s/g;
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match) => {
        return `<span style="color: yellow">${match}</span>`;
    });
    

    // Try-Except - teal
    re = /(\btry\b|\bexcept\b)/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: aquamarine">${captureGroup1}</span>`;
    })

    // None keyword - red
    re = /(None)/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: red">${captureGroup1}</span>`;
    })

    // Operator - yellow
    re = /[^<>](\/\/|\+\=|\=|\+|\-|\/|\*)\s/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return ` <span style="color: goldenrod">${captureGroup1}</span> `;
    })

    /*
    // Functions - pink
    re = /(\w+\(|\))/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: hotpink">${captureGroup1}</span>`;
    })
    */


    // Strings - idk
    re = /((\s|\[|\()("([^"]+)"))/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1, CaptureGroup2) => {
        return `<span style="color: lime">${captureGroup1}</span>`;
    })

    // Brackets - idk
    re = /(\[|\])/g
    code_container.innerHTML = code_container.innerHTML.replaceAll(re, (match, captureGroup1) => {
        return `<span style="color: pink">${captureGroup1}</span>`;
    })

}

/*
text_options = [
    `def generate_unique_uid(self):
    \t"""
    \tGenerates a unique user id
    \tReturns:
    \t\tstring: The unique user id
    \t"""
    \tuid = None
    \twhile True:
    \t\tuid = str(uuid.uuid4())
    \t\tself.cursor.execute('''
    \t\tSELECT COUNT(*) FROM user_login WHERE validation_token = ?
    \t\t''', (uid, ))
    \t\tcount = self.cursor.fetchone()[0]
    \t\tif count == 0:
    \t\t\tbreak # Only break if no other user has the same token
    \treturn uid`,

    `def query_search():
    \tglobal file_num
    \tfor i in range(start, len(search_queries)):
    \t\tquery = search_queries[i]
    \t\tprint("Query: " + query)
    \t\tsongs = get_all_songs(query)
    \t\twith open('song_titles'+str(file_num)+'.json', 'r') as f:
    \t\t\ttry:
    \t\t\t\texisting_songs = json.load(f)
    \t\t\texcept json.JSONDecodeError:
    \t\t\t\texisting_songs = []
    \t\texisting_songs.extend(songs)
    \t\twith open('song_titles'+str(file_num)+'.json', 'w') as f:
    \t\t\tjson.dump(existing_songs, f)
    \t\twith open('song_titles_progress.json', 'w') as f:
    \t\t\tjson.dump("i: "+ str(i) + " File: " + str(file_num), f)
    \t\tif i%100 == 0:
    \t\t\tfile_num += 1`,

    `def merge_sort(arr):
    \tif len(arr) <= 1:
    \t\treturn arr
    \tmid = len(arr) // 2
    \tleft = merge_sort(arr[:mid])
    \tright = merge_sort(arr[mid:])
    
    \treturn merge(left, right)

def merge(left, right):
    \tsorted_arr = []
    \twhile left and right:
    \t\tif left[0] < right[0]:
    \t\t\tsorted_arr.append(left.pop(0))
    \t\telse:
    \t\t\tsorted_arr.append(right.pop(0))
    
    \tsorted_arr.extend(left or right)
    \treturn sorted_arr`,

    `def game_of_life(grid):
    \tnew_grid = np.copy(grid)
    \trows, cols = grid.shape
    
    \tfor i in range(rows):
    \t\tfor j in range(cols):
    \t\t\tneighbors = sum([grid[i + x][j + y] for x in [-1, 0, 1] for y in [-1, 0, 1] if (x != 0 or y != 0) and 0 <= i + x < rows and 0 <= j + y < cols])
    \t\t\tif grid[i, j] == 1 and (neighbors < 2 or neighbors > 3):
    \t\t\t\tnew_grid[i, j] = 0
    \t\t\telif grid[i, j] == 0 and neighbors == 3:
    \t\t\t\tnew_grid[i, j] = 1
    \treturn new_grid`,

    `def simulated_annealing(problem, initial_solution, temperature, cooling_rate):
    \tcurrent_solution = initial_solution
    \tcurrent_cost = problem(current_solution)
    
    \twhile temperature > 1:
    \t\tneighbor = get_neighbor(current_solution)
    \t\tneighbor_cost = problem(neighbor)
        
    \t\tif neighbor_cost < current_cost or random.random() < math.exp((current_cost - neighbor_cost) / temperature):
    \t\t\tcurrent_solution = neighbor
    \t\t\tcurrent_cost = neighbor_cost
        
    \t\ttemperature *= cooling_rate
    
    \treturn current_solution`
]
*/
text_options = [
    `\timport  time
    
    \t class  Me():
    \t\t def __init__():
    \t\t\tself.name = "Josef Wolf"
    \t\t\tself.education = "2nd Year Undergrad"
    \t\t\tself.skills = [ "Python", "Java", "C", "JavaScript", "HTML", "CSS", "Machine Learning", "Flask", "Data Analysis and Presentation" ]
    \t\t\tself.contact = [ "josefwolf591@gmail.com", "https://www.linkedin.com/in/josef-j-wolf/", "https://github.com/JosefJW" ]
    
    \t\t def analyze_data(data):
    \t\t\tprint( "On it!" )
    \t\t\t time.sleep(some_time)
    \t\t\treturn analyzed_data

    \t\t def code_feature(feature):
    \t\t\tprint( "Right away!" )
    \t\t\t time.sleep(some_time)
    \t\t\treturn feature_report

    \t\t def debug_code(code):
    \t\t\tprint( "Do I have to?" )
    \t\t\t time.sleep(some_time)
    \t\t\treturn debugged_code
    `
]

for (let i = 0; i < text_options.length; i++) {
    const text = text_options[i];

    let wait = 0;
    for (let j = 0; j < i; j++) {
        wait += text_options[j].length
    }
    wait = wait*30+i*5000
    console.log(wait);

    setTimeout(function() {
        type_text(text, wait);
    }, wait);
}
