import { Component, OnInit, Input } from "@angular/core";
import { Contact } from "../services/contact.service";

@Component({
	selector: "Avatar",
	moduleId: module.id,
	templateUrl: "./avatar.component.html",
	styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
	@Input() person: Contact;
	@Input() displayName = true;
	@Input() width = 42;
	@Input() height = 42;

	constructor() {
	}

	ngOnInit(): void {
	}
}