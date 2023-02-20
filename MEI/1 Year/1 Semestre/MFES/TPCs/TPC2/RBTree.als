sig Node {
	children : set Node
}
sig Leaf extends Node {}
one sig Root in Node {}

sig Red, Black in Node {}

pred Invs {
  
  	// Specify the properties that characterize 
    // red-black binary trees inside this predicate.

	// The number of points you will get is proportional to the number of correct properties.
	// To check how many points you have so far you can use the different commands. 
    // The maximum is 5 points.
  
	// Be careful to not overspecify! 
	// If some of your properties are not valid in a red-black tree you get 0 points, 
    // even if you have some correct properties.
	// To check if you are not overspecifying you can use command NoOverspecification. 
	// If you are overspecifying this command will return a tree that should be possible 
	// but that you spec is not accepting.
  
  // ========================================
  // ||			    PROPERTIES			   ||
  // ========================================
 
  			no children.Root
  
  			all x : Node | x not in x.children

  			all x : Node | lone children.x
  			
  			all r : Root | r in Black
  
  			all node : Leaf | no node.children
  
  			all n : Node | Red + Black = Node && n not in Red & Black
  
  			all node : Leaf | node in Black

			all x : Red | x.children in Black
  
  			all x : Node-Leaf | #(x.children) = 2
  
  			all x : Red | x.children not in Red && children.x not in Red
  			
  			all x : Node-Root | #(children.x) = 1
    
  			all x : Node | x not in x.^children
			
  			all x, y : Leaf | #(^children.x & Black) = #(^children.y & Black)
}