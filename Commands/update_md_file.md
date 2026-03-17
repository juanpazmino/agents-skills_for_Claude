Check if a CLAUDE.md file exists in the current working directory.                                                                                                       
                                                                                                                                                                           
  If CLAUDE.md does NOT exist:                                                                                                                                             
  Use the AskUserQuestion tool to ask: "No CLAUDE.md file was found. Would you like to create one?"                                                                        
  - If the user answers No: Stop the process entirely. Do not proceed.                                                                                                     
  - If the user answers Yes: Create a new CLAUDE.md file. Analyze the project (structure, stack, conventions, key files, scripts) and populate it with relevant context    
  that would help Claude work effectively in this project.                                                                                                                 
                                                                                                                                                                           
  If CLAUDE.md DOES exist:                                                                                                                                               
  Read the current CLAUDE.md file. Then analyze the project to identify anything that has changed or is missing — new files, new dependencies, new scripts, changed        
  conventions, new environment variables, updated architecture. Update the CLAUDE.md file to reflect these changes while preserving existing content that is still         
  accurate.